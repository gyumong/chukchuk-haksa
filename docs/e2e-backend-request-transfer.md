# 협조 요청 C: 편입생(TRANSFER) 졸업진단 테스트 시딩 엔드포인트

수신: 백엔드 팀
발신: FE 팀 (졸업요건 화면 · e2e 하네스)
관련 FE 브랜치: `feat/transfer-graduation-progress` (편입생 UI + `e2e/tests/transfer-graduation.spec.ts`)
선행 문서: `e2e-backend-request.md` (요청 A 토큰 발급 · 요청 B 리셋 → 현재 `/api/admin/*` 로 구현됨)

---

## 1. 배경

`GET /api/graduation/progress` 에 편입생 부분 진단(`analysisType: TRANSFER`, `transferProgress`)이 추가되었고, FE 는 이를 소비하는 화면을 구현했습니다.

- 맨 위 **지정과목 | 이수한 학점** 카드(드롭다운으로 과목별 이수 여부) + 표시 형식 안내 (i)
- 전핵·전선(`evaluationType: COMPARISON`) 은 **이수 / 기준** 그대로, 그 외(`EARNED_ONLY` · `UNAVAILABLE`) 는 **이수 학점만**

문제는 **이 분기를 실제 백엔드 응답으로 볼 방법이 없다**는 것입니다.

- 편입 여부·편입 학년·인정학점·지정과목은 포털 크롤러 스냅샷에서 오는 값이라(`manualReviewReasons` 의 `TRANSFER_ENTRY_GRADE_UNKNOWN` · `RECOGNIZED_CREDITS_INCOMPLETE` · `DESIGNATED_COURSES_NOT_VERIFIED`, `designatedCoursesNeedsRefresh`) FE 도, 현재 Admin Test API 도 건드릴 수 없습니다.
- 현재 Admin Test API(`POST /api/admin/test-users`, `POST /api/admin/me/test-courses`, `PATCH /api/admin/me/graduation-courses`, `PATCH /api/admin/me/major`, `POST /api/admin/me/reset`)는 **일반 학생의 수강·전공** 만 시딩합니다. 편입 관련 필드는 없습니다.
- 그래서 FE e2e 는 지금 `page.route()` 로 `/api/graduation/progress` 응답을 fixture 로 **통째로 바꿔** 렌더만 검증합니다. 이 방식은 백엔드의 50% 기준 산출 · `countedCredits` · `fulfilled` · `UNAVAILABLE` 판정을 전혀 거치지 않습니다.

## 2. 요청 원칙 — 출력 주입이 아니라 **입력 시딩**

`TransferGraduationProgressDto` 를 그대로 받아 저장하는 엔드포인트는 **원하지 않습니다**. 크롤러가 채우는 **입력 값** 만 테스트 계정에 심을 수 있게 해 주시고, 진단 계산은 프로덕션과 동일한 코드가 돌아야 합니다. 그래야 e2e 가 백엔드 로직의 회귀도 함께 잡습니다.

## 3. 엔드포인트 스펙(제안)

기존 `/api/admin/me/*` 규약을 그대로 따릅니다 — dev 전용, `Authorization: Bearer <테스트 계정 accessToken>`, 응답은 `{ success, data, message }` 래퍼.

### C-1. `PATCH /api/admin/me/transfer-profile` — 현재 계정 편입 상태 설정

```json
{
  "isTransfer": true,
  "transferEntryGrade": 3,
  "transferYear": 2024,
  "recognizedTransferCredits": 65,
  "completedSemesters": 3,
  "designatedCourses": [
    { "courseCode": "test_C101", "courseName": "테스트 지정 자료구조", "credits": 3 },
    { "courseCode": "test_C102", "courseName": "테스트 지정 알고리즘", "credits": 3 }
  ]
}
```

| 필드                        | 의미                                                                                                      | 비우면                                                                             |
| --------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `isTransfer`                | `true` → TRANSFER 진단, `false` → REGULAR 로 복귀                                                         | 필수                                                                               |
| `transferEntryGrade`        | 편입 학년 (기준 연도 산출 입력)                                                                           | `TRANSFER_ENTRY_GRADE_UNKNOWN` 사유 발생                                           |
| `transferYear`              | 편입 연도. 기준은 `transferYear - 2` 의 학과 일반 학생 전핵·전선 기준 × 50%                               | 학번/입학년도에서 유도 가능하면 생략 허용 (6장)                                    |
| `recognizedTransferCredits` | 편입 인정학점                                                                                             | `RECOGNIZED_CREDITS_INCOMPLETE`                                                    |
| `completedSemesters`        | 저장된 이수 학기 수                                                                                       | `REGISTERED_SEMESTERS_NOT_VERIFIED`                                                |
| `designatedCourses`         | 지정과목 스냅샷(코드·이름·원본 학점). **이수 상태는 보내지 않음** — 백엔드가 학생 수강 기록과 매칭해 판정 | `null` → `designatedCoursesNeedsRefresh: true` + `DESIGNATED_COURSES_NOT_VERIFIED` |

응답(제안): `{ success, data: { analysisType: "TRANSFER", message }, message }`

- 멱등(같은 바디 반복 호출 결과 동일).
- `POST /api/admin/me/reset` 이 이 상태도 함께 지워 REGULAR 로 돌아가야 합니다(현재 reset 은 "수강 데이터와 전공 상태" 만 명시).

### C-2. (선택) `POST /api/admin/test-users` 에 `transfer` 블록 추가

e2e 하네스는 테스트마다 **새 계정을 만들어** 토큰 회전 문제를 피합니다(`e2e/fixtures/auth.ts` `loginAs`). 생성 시점에 C-1 과 같은 필드를 받을 수 있으면 `loginAs('transfer')` 한 줄로 끝나 하네스가 단순해집니다. C-1 만 있어도 동작하므로 우선순위는 낮습니다.

```json
{ "name": "편입테스트", "departmentId": 1, "admissionYear": 2024, "isPortalLinked": true,
  "transfer": { "transferEntryGrade": 3, "transferYear": 2024, "recognizedTransferCredits": 65, "completedSemesters": 3, "designatedCourses": [ ... ] } }
```

## 4. 만들 수 있어야 하는 시나리오 (FE 분기 ↔ 시딩 조합)

FE 가 분기하는 모든 경우를 **기존 Admin API + C-1 조합** 으로 재현할 수 있어야 합니다. 새 필드가 필요한 곳만 ★.

| FE 표시                                                                       | 필요한 백엔드 상태                                    | 시딩 방법                                                                                                                                                    |
| ----------------------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 전핵 `12 / 10.5 ✓` (COMPARISON 충족)                                          | 학과에 `transferYear-2` 기준 존재, 전핵 counted ≥ 50% | C-1 ★ + `test-courses(area: 전핵)`                                                                                                                           |
| 전선 `9 / 16.5` (COMPARISON 미충족)                                           | 위와 같고 counted < 50%                               | 같은 조합, 과목 수만 조절                                                                                                                                    |
| 기준 소수점 (`10.5`)                                                          | 일반 기준이 홀수(예: 21)                              | 기준 21 인 학과 선택 — `GET /api/admin/test-options` 에 학과별 기준 노출되면 선택이 쉬움 (6장)                                                               |
| 중핵 `9학점` (EARNED_ONLY)                                                    | 전핵·전선 외 영역 수강                                | `test-courses(area: 중핵)` — 기존 API 로 충분                                                                                                                |
| 복핵 (UNAVAILABLE)                                                            | 복수전공 적용 정책 미확정                             | `PATCH /api/admin/me/major { dualMajorEnabled: true }` + `test-courses(area: 복핵)` — 기존 API                                                               |
| 전핵·전선 UNAVAILABLE + `unavailableReasons`                                  | 해당 학과·연도 기준 없음                              | 기준 없는 학과/`transferYear` 조합 ★                                                                                                                         |
| 지정과목 `이수`                                                               | 스냅샷 코드와 같은 코드의 수강 기록 존재              | C-1 ★ `designatedCourses[].courseCode` = `test-courses` 로 만든 `courseCode` (test-courses 는 `test_` prefix 자동 부여 → 스냅샷 코드도 `test_` 로 맞춤, 6장) |
| 지정과목 `미이수`                                                             | 매칭 수강 기록 없음                                   | C-1 ★ 만                                                                                                                                                     |
| 지정과목 `확인 필요` (UNKNOWN)                                                | 판정 불가 상태                                        | **도출 규칙 확인 필요** (6장)                                                                                                                                |
| 지정과목 `학점 확인 불가` (`designatedEarnedCredits: null`)                   | `designatedCreditUnavailableReasons` 발생             | 도출 규칙 확인 필요 (6장)                                                                                                                                    |
| 지정과목 카드 안내문 "포털 새로고침…" (`designatedCoursesNeedsRefresh: true`) | 스냅샷 없음                                           | C-1 ★ `designatedCourses: null`                                                                                                                              |
| `manualReviewReasons` 각 사유                                                 | 해당 입력 누락                                        | C-1 ★ 필드를 하나씩 비움                                                                                                                                     |
| REGULAR 로 복귀                                                               | 편입 상태 해제                                        | C-1 `isTransfer: false` 또는 `reset`                                                                                                                         |

## 5. 수용 기준(Acceptance Criteria)

- [ ] linked 테스트 계정에 C-1 호출 후 `GET /api/graduation/progress` 가 `analysisType: TRANSFER`, `analysisStatus: MANUAL_REVIEW_REQUIRED`, `transferProgress` 채움.
- [ ] `transferProgress.areas[]` 의 전핵·전선이 `evaluationType: COMPARISON` 이고 `requiredCredits` = (`transferYear-2` 학과 일반 기준) × 0.5 (소수점 유지), `fulfilled` = `countedCredits ≥ requiredCredits`.
- [ ] 전핵의 `countedCredits` 에 전취 과목 학점이 합산되지 않는다(스펙 명시 사항) — `test-courses(area: 전취)` 를 섞어 확인.
- [ ] 전핵·전선 외 영역은 `EARNED_ONLY`, 복수전공 영역은 `UNAVAILABLE` + `unavailableReasons` 비어 있지 않음.
- [ ] `designatedCourses[].status` 가 수강 기록 매칭으로 `COMPLETED` / `NOT_COMPLETED` 로 갈리고, `designatedEarnedCredits` = COMPLETED 과목 학점 합.
- [ ] `designatedCourses: null` 로 설정 시 `designatedCoursesNeedsRefresh: true`, `manualReviewReasons` 에 `DESIGNATED_COURSES_NOT_VERIFIED`.
- [ ] `isTransfer: false` 및 `POST /api/admin/me/reset` 후 `analysisType: REGULAR`, `transferProgress` 없음.
- [ ] 멱등 · dev 전용(프로덕션 비활성) · 응답 `{ success, data, message }` 래퍼 — 기존 `/api/admin/*` 와 동일 게이팅.
- [ ] 위가 되면 FE 는 `transfer-graduation.spec.ts` 의 `page.route` fixture 를 제거하고 실제 응답으로 전환한다.

## 6. 협의 필요 항목

- **지정과목 `status` 도출 규칙**: `COMPLETED` 는 `courseCode` 매칭인지 `courseName` 매칭인지, 재수강/F 처리, 그리고 `UNKNOWN` 이 나오는 조건(스냅샷에 코드 없음? 수강 기록 미검증?). FE 는 세 상태를 모두 표시하므로 재현 방법이 필요합니다.
- **`designatedCreditUnavailableReasons` 발생 조건**: `designatedEarnedCredits: null` 을 어떻게 만들 수 있는지.
- **`test_` prefix 정합**: `test-courses` 가 학수번호에 `test_` 를 자동 부여하므로 스냅샷 `designatedCourses[].courseCode` 도 `test_` 로 보내야 매칭되는지, 아니면 백엔드가 prefix 를 정규화하는지.
- **`transferYear` 출처**: 학번/입학년도에서 유도하는지(그러면 필드 불필요), 명시 입력이 필요한지. 편입 학년 3 기준 "편입연도 - 2" 규칙이 2학년 편입에도 같은지.
- **기준 없는 학과 재현**: UNAVAILABLE(기준 없음) 을 만들려면 기준이 없는 `(학과, 연도)` 조합을 알아야 합니다. `GET /api/admin/test-options` 에 학과별 기준 보유 연도(또는 전핵·전선 기준 학점)를 노출해 주시면 시나리오 선택이 결정적으로 됩니다.
- **`reset` 범위**: 편입 상태를 reset 이 함께 지우는지, 별도 `isTransfer: false` 만 허용하는지.
- **C-2 채택 여부**: `test-users` 생성 시 편입 블록 수용 여부(하네스 단순화용, 없어도 동작).

## 7. FE 가 이미 해둔 것 (참고)

- `useTransferProgressQuery` — `analysisType === 'TRANSFER' && transferProgress` 일 때만 편입생 섹션. REGULAR/미제공은 기존 화면.
- `TransferAreaProgressSection` — COMPARISON 은 `countedCredits ?? earnedCredits` / `requiredCredits`, 그 외는 `earnedCredits` 만. `fulfilled` 로 체크 표시.
- `transferProgressUtils` 단위 테스트 12개, Playwright 스펙 1개(현재 fixture, C 수용 후 실응답 전환).
