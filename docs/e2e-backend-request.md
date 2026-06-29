# 협조 요청: e2e(Playwright) 테스트 계정 토큰 발급 & 상태 리셋 엔드포인트

수신: 백엔드/운영 팀
발신: FE 팀 (e2e 하네스)
관련 코드 브랜치: `feat/playwright-e2e`

---

## 1. 배경

FE e2e 자동화(Playwright)가 **Phase 1+** 로 진입하면서, 인증된 사용자 시나리오를 안정적으로 돌리려면 백엔드/운영 팀의 두 가지 협조가 필요합니다.

- **토큰 소비 경로**: 하네스는 인증 우회를 위해 기존 프로덕션 엔드포인트인 **`POST /api/session` 토큰 익스체인지(옵션 C)** 를 그대로 재사용합니다. 이 엔드포인트는 네이티브/MPA WebView 가 보유한 `accessToken`/`refreshToken` 한 쌍을 받아, FE 서버가 iron-session 으로 봉인한 httpOnly 쿠키 `cchaksa_session` 을 `Set-Cookie` 합니다. 즉 FE 측 신규 작업은 0이고, 백엔드는 **"테스트 계정용 유효한 ac/re 토큰을 안정적으로 공급"** 하기만 하면 됩니다 (`src/app/api/session/route.ts:227-295`).
  - **전제**: 이 익스체인지는 FE Next.js 라우트 핸들러가 도는 same-origin 서버 인스턴스가 e2e 환경에 기동되어 있어야 동작합니다(토큰만으로 끝나는 게 아니라, FE 서버가 백엔드를 server-to-server 로 호출함).
- **probe 의존성**: `POST /api/session` 핸들러는 받은 `accessToken` 으로 실제 백엔드를 **병렬 호출**합니다 — `GET /api/users/me` (포털 연동 여부 probe) 와 `GET /api/users/analytics-id`. 이 중 **토큰 유효성/연동 판정을 좌우하는 것은 `GET /api/users/me` probe 결과뿐**이며, `analytics-id` 는 실패해도 `null` 로 graceful-degrade 해 익스체인지 진행에 영향을 주지 않습니다. 따라서 하네스 토큰은 **백엔드 `/api/users/me` 가 200 을 돌려주는 진짜 토큰** 이어야 합니다 (`route.ts:248-251, 287-291, 73-110`).
- **익스체인지 성공 판정 주의**: `POST /api/session` 은 토큰이 무효여도(probe 불확정) **`400` 이 아니면 `200 {ok:true, isPortalLinked:false}`** 를 반환할 수 있습니다(빈/오류 세션). 따라서 하네스는 **`200` 단독으로 성공을 단정하지 않고**, `Set-Cookie: cchaksa_session=...` 존재 + 후속 `GET /api/session` `200` 으로 검증합니다 (`route.ts:276, 294`).
- **쿠키 삭제만으로 reset 이 안 되는 이유**: `isPortalLinked`(연동 여부)는 요청 바디에서 받지 않고, **`POST /api/session` 익스체인지 경로에서는 오직 `GET /api/users/me` probe 결과로만 결정** 됩니다 (`route.ts:223-225, 276`). (참고: OAuth 콜백 `POST /api/users/signin` 은 별도로 바디의 `isPortalLinked` 를 세션에 시딩하나, 이후 `GET /api/session` probe 로 재검증되며 하네스는 이 콜백 경로를 쓰지 않습니다.) 따라서 쿠키(`cchaksa_session`)를 지워도 다음 로그인 시 probe 가 백엔드에서 `isPortalLinked:true` 를 다시 읽어 그대로 재승격됩니다. **연동↔미연동 상태를 뒤집으려면 반드시 백엔드 사용자 레코드가 바뀌어야** 하며, 이것이 별도 reset 엔드포인트가 필요한 핵심 이유입니다 (`route.ts:155, 203-205`).

---

## 2. 요청 A — 테스트 계정 토큰 발급

### A-1. FE 가 정확히 필요로 하는 것

`POST /api/session` 요청 바디는 **정확히 두 필드만** 읽습니다 (그 외 필드는 무시; `isPortalLinked` 는 바디에서 절대 받지 않음):

```json
POST {baseURL}/api/session
Content-Type: application/json

{
  "accessToken":  "<백엔드 발급 JWT 액세스 토큰, 비어있지 않은 string>",
  "refreshToken": "<백엔드 발급 리프레시 토큰, 비어있지 않은 string>"
}
```

- 두 필드 모두 `string` 이고 `length>0` 이어야 합니다. 아니면 `400 MISSING_ACCESS_TOKEN` / `400 MISSING_REFRESH_TOKEN` (`route.ts:237-242`). (바디 JSON 파싱 실패 시 `400 INVALID_JSON`, `route.ts:229-233`.)
- **토큰 형식 요구사항**:
  - `accessToken` 은 **JWT** 로 취급됩니다. FE 가 payload 세그먼트를 base64url 디코드해 `exp`(초 단위 epoch) 클레임을 읽어 잔여 수명을 판정합니다(서명 검증은 안 함). `exp` 가 없거나 디코드 실패면 fast-path 자격 판정이 false 가 됩니다 (`route.ts:41-57`).
  - `refreshToken` 은 형식상 비어있지 않은 `string` 이면 1차 검증을 통과합니다. **다만 `accessToken` 으로 첫 probe 가 곧바로 `ok`/`not-linked`(=백엔드 `/api/users/me` 200)를 못 받는 경우**(cold-start/만료/일시오류)에는 핸들러가 자동으로 백엔드 `POST /api/auth/refresh` 를 호출해 재발급 후 재-probe 하므로, 그 시나리오에서는 `refreshToken` 도 **백엔드 refresh 에서 통과하는 유효한 진짜 토큰** 이어야 합니다 (`route.ts:260-270`). fixture 토큰의 `exp` 를 충분히 멀게 잡으면 첫 probe 가 바로 통과해 refresh 경로를 타지 않지만, 안전을 위해 두 토큰 모두 신선하게 공급하길 권장합니다.
- 필요한 계정은 **2개**: 연동(linked) 계정 1개, 미연동(unlinked) 계정 1개.

### A-2. 토큰 공급 방식 — 옵션 비교

| 방식 | 설명 | 장점 | 단점 |
|---|---|---|---|
| **(1) env-gated 발급 엔드포인트** | 예: `POST /api/test/token/{role}` 가 비프로덕션 환경에서만 동작해 해당 role 의 유효 ac/re 쌍을 즉시 반환 | 항상 신선한 토큰, 수명/회전 문제 자동 해소, CI 가 런타임에 토큰 획득 가능 | 백엔드 신규 구현 필요, **환경 게이팅 철저(프로덕션 비활성)** 필수 |
| **(2) CI secret 으로 주입(운영팀 회전)** | 운영팀이 장수명 토큰을 발급해 CI secret 에 저장, 주기적으로 수동 회전 | 백엔드 신규 구현 없음, 가장 빠른 착수 | 토큰 만료 시 CI 가 그린→레드로 깨짐, 수동 회전 운영 부담, secret 유출 리스크 |
| **(3) seed 스크립트** | 테스트 환경 부팅 시 고정 시드 계정을 생성하고 ac/re 를 산출하는 스크립트 | 환경 재현성 높음, reset(요청 B)과 한 흐름으로 묶기 좋음 | 시드 환경 별도 운영 필요, 토큰 만료 정책에 여전히 종속 |

### A-3. 추천

- **1순위: (1) env-gated 발급 엔드포인트.** A-2 표의 토큰 수명/회전 문제를 근본적으로 없애고(CI 가 매 런마다 신선한 토큰을 획득), 요청 B 의 reset 엔드포인트와 동일한 환경 게이팅·인증 정책을 공유할 수 있어 운영이 일관됩니다.
- **즉시 착수가 필요하면 (2)** 로 시작하되, **`exp` 를 충분히 멀게(예: 최소 e2e 런 주기보다 길게)** 잡은 장수명 토큰을 발급해 주십시오. 이때 회전 주기와 책임자를 명시해야 CI 가 조용히 깨지지 않습니다.

### A-4. 토큰 수명/회전 관련 확인 필요

- fast-path 와 probe 가 의도대로 동작하려면 fixture `accessToken` 의 `exp` 가 충분히 멀어야 합니다 (`route.ts:41-57, 34, 151`). **테스트용 장수명 토큰 발급이 가능한지** 확인 부탁드립니다.
- `cchaksa_session` 쿠키와 seal TTL 은 둘 다 30일(2592000초)로 일치시켜 둔 상태이며(`session.ts:6, 17, 22-32`), e2e 런 주기보다 충분히 길어 **FE 쿠키/seal 만료는 문제되지 않습니다**. 관건은 **백엔드 `accessToken` 자체의 `exp`** 이며, 이는 FE 쿠키 수명과 별개입니다.
- 리프레시 흐름까지 검증하는 시나리오(장시간 세션, `POST /api/session/refresh`)가 있으면 `refreshToken` 도 백엔드 `POST /api/auth/refresh` 에서 유효해야 합니다. 이 경로는 응답 바디에 새 `accessToken` 만 노출하고 `refreshToken` 은 httpOnly 쿠키로만 갱신하며, 실패 시 `401 NO_REFRESH_TOKEN`/`REFRESH_FAILED` 로 세션을 폐기합니다 (`src/app/api/session/refresh/route.ts:7-28`).

---

## 3. 요청 B — 상태 리셋 엔드포인트

현재 코드에는 서버 사이드 상태를 되돌리는 수단이 없습니다. `DELETE /api/session` 은 쿠키만 지울 뿐(`session.destroy()`) 백엔드 데이터(연동 플래그, target_gpa, 미완료 job 등)는 그대로입니다 (`route.ts:210-214`). 아래 스펙을 제안드립니다.

### B-1. 엔드포인트 스펙(제안)

- **Path**: `POST /api/test/reset/{role}`
- **role 값**: `linked` | `unlinked`
- **응답 형태**: 기존 `POST /api/student/reset` 과 동일한 SpringBoot 래퍼 `{ success, data: { message }, message }` 권장 (`SuccessResponseMessageOnlyResponse`, `src/shared/api/data-contracts.ts:187-200, 933`)
- **계정 식별**: 테스트 계정의 정체성(같은 kakao/apple user → 같은 userId, 같은 ac/re 토큰)은 **보존** 되어야 하며, 오직 per-user 백엔드 상태만 변경. `Authorization: Bearer <accessToken>` 로 대상 사용자를 식별할지, `{role}` path 가 고정 시드 계정을 선택할지는 협의 필요(6장 참조).

### B-2. role 별 복원해야 할 상태

**ROLE = unlinked** — `GET /api/users/me` 가 `data.isPortalLinked=false` 를 반환하게 만드는 것이 핵심 (`route.ts:94-98, 203-204`):
- (1) 사용자의 포털 연동 플래그를 **false** 로 설정 → `/me` 가 `isPortalLinked:false`
- (2) 스크래핑된 학사 데이터 전부 삭제 → `GET /api/student/profile` 이 401/404 또는 빈 값(profile, semesters, grades, graduation-progress, academic summary/record — 기존 `POST /api/student/reset` 이 지우는 surface 와 동일, `src/shared/api/domain/student/Student.ts:43-59`)
- (3) `target_gpa` 클리어 (`POST /api/student/target-gpa` 로 설정되는 별도 필드, 범위 0–4.5, `Student.ts:25-42`; `data-contracts.ts:918-929`)
- (4) 진행 중/실패한 portal-link job 삭제·종료 → stale `/portal/link/jobs/{jobId}` 잔존 방지 (`src/shared/api/domain/portallink/PortalLink.ts:71-95`)
- 참고: 기존 `POST /api/student/reset` + **사용자 레벨 연동 플래그 강제 false** 와 동등. 다만 `/api/student/reset` 이 연동 플래그까지 내리는지는 계약상 불명확 → 백엔드 확인 필요(FE 는 이 엔드포인트를 호출하지 않아 wipe 범위 검증 불가).
- FE 쿠키의 `isPortalLinked:true` 는 이 엔드포인트가 직접 리셋하지 않으나, 다음 `GET /api/session` probe 가 `not-linked` 를 읽어 자기교정됩니다 (`route.ts:158-162`). **단, fast-path(`route.ts:145-153`) 때문에 토큰 잔여수명 60초 동안은 probe 없이 stale `true` 가 서빙될 수 있으므로**, `afterEach` 에서 `DELETE /api/session` 또는 fresh browser context 사용이 **권장이 아니라 사실상 필수** 입니다.

**ROLE = linked** — `GET /api/users/me` 가 `data.isPortalLinked=true` 이고 `GET /api/student/profile` 이 유효한 200 프로필을 반환하게 만드는 것 (`route.ts:65`):
- (1) 포털 연동 플래그를 **true** 로 설정
- (2) 알려진 정상(known-good) 학사 스냅샷을 seed/복원하되, **`reconnectionRequired=false`** 로 설정해 `useProfileQuery` 가 `/resync/login`(웹뷰는 MPA resync)으로 리다이렉트하지 않게 (`src/features/dashboard/apis/queries/useProfileQuery.ts:22-26`; `data-contracts.ts:398`). 시나리오가 요구하면 semesters/grades/graduation/academic-summary 도 함께.
- (3) `target_gpa` 를 알려진 baseline 으로 리셋하거나 unset (테스트가 target-score 퍼널 단계를 검증하는지에 따라 — 6장 협의)
- (4) 이전 런의 진행 중/실패 job 정리
- 이 방향은 `POST /api/student/reset`(de-link/wipe 전용 추정)으로는 **불가능** 하므로 seed/re-link primitive 가 필요. 전용 테스트 엔드포인트가 필요한 이유입니다.

**참고 — reset 불필요 항목**: agreement/동의 단계는 순수 클라이언트 `useState` 로 백엔드 영속이 전혀 없어 리셋 대상 아님 (`src/app/(funnel)/agreement/page.tsx:14, 29-31`). account-level 삭제(`DELETE /api/users/delete`)는 계정 자체를 제거해 테스트 정체성/토큰을 깨므로 **reset 에 사용 금지** (`src/shared/api/domain/user/User.ts:77-93`).

---

## 4. 보안 / 환경 게이팅 요구사항

- **프로덕션 비활성 필수**: 요청 A(env-gated 발급)·요청 B(reset) 엔드포인트는 **프로덕션 환경에서 반드시 비활성화** 되어야 합니다. 임의 토큰 발급/상태 초기화가 프로덕션에서 노출되면 안 됩니다.
- **인증 게이팅**: reset 엔드포인트는 기존 `@secure` 라우트처럼 per-user bearer 토큰을 요구하거나, 별도 테스트 전용 시크릿/헤더로 게이팅하는 방식 중 협의로 결정.
- **참고**: `POST /api/session` 자체에는 env-gate 가 없어 프로덕션 포함 모든 환경에 존재하지만, 유효한 ac/re 토큰이 백엔드(`/api/users/me`, `@secure`)에서 통과해야만 의미 있게 동작합니다(쿠키 `secure` 플래그만 `NODE_ENV=production` 분기, `src/lib/auth/session.ts:28`). 단, 앞서 언급했듯 **POST 는 토큰이 무효여도 `200 {ok:true,isPortalLinked:false}`+빈/오류 세션을 반환할 수 있으므로**(`route.ts:276, 294`), 익스체인지 진위 검증은 `200` 단독이 아니라 `Set-Cookie` 존재 + 후속 `GET /api/session` `200` 으로 합니다. 따라서 보안 표면은 **"유효 토큰을 누가 어떻게 발급받느냐"** 에 집중됩니다.
- **계정 정체성 보존**: reset 은 절대 계정을 삭제하지 않고 per-user 상태만 변경해야 합니다(같은 userId·같은 ac/re 토큰 유지). 그래야 다음 런의 `POST /api/session` 익스체인지가 동일 토큰으로 재동작합니다.

---

## 5. 수용 기준(Acceptance Criteria) 체크리스트

**요청 A — 토큰**
- [ ] linked 계정의 유효한 `accessToken`/`refreshToken` 쌍을 CI 가 안정적으로 획득할 수 있다.
- [ ] unlinked 계정의 유효한 `accessToken`/`refreshToken` 쌍을 CI 가 안정적으로 획득할 수 있다.
- [ ] 두 토큰으로 `POST /api/session` 호출 시 `200` + `Set-Cookie: cchaksa_session=...` 가 내려온다. (`200` 단독이 아니라 Set-Cookie 존재 + 후속 GET 으로 성공 판정한다.)
- [ ] linked 토큰으로 익스체인지 후 응답이 `{ ok:true, isPortalLinked:true }` 이고, 후속 `GET /api/session` 이 `200` 에 `isPortalLinked:true` 다.
- [ ] unlinked 토큰으로 익스체인지 후 응답이 `{ ok:true, isPortalLinked:false }` 이다(미연동도 `GET /api/users/me` 가 `401/404` 가 아닌 `200`+`isPortalLinked:false` 를 반환해야 함 — 6장 첫 항목).
- [ ] fixture `accessToken` 의 `exp` 가 e2e 런 주기 대비 충분히 멀어 fast-path/probe 가 의도대로 동작한다.

**요청 B — reset**
- [ ] `POST /api/test/reset/unlinked` 호출 후 `GET /api/users/me` 가 `isPortalLinked:false`, `GET /api/student/profile` 이 401/404/빈 값, `target_gpa` 미설정, 잔존 job 없음.
- [ ] `POST /api/test/reset/linked` 호출 후 `GET /api/users/me` 가 `isPortalLinked:true`, `GET /api/student/profile` 이 `reconnectionRequired:false` 인 유효 200 프로필.
- [ ] reset 전후로 계정 정체성(userId·ac/re 토큰)이 보존된다.
- [ ] 두 엔드포인트(A 발급 + B reset) 모두 프로덕션에서 비활성/접근 불가임이 확인된다.
- [ ] 응답이 `{ success, data:{message}, message }` 래퍼 형태다.

---

## 6. 협의 필요 항목

- **`GET /api/users/me` 의 미연동 사용자 응답**: 미연동 사용자에게도 반드시 `200`(+`isPortalLinked:false`)을 반환하는지 확인 필요. 과거 `/api/student/profile` 방식은 미연동을 `404`/프로덕션 `401` 로 표현해 토큰 무효와 혼동시켰고, FE 에는 그에 대한 방어 폴백이 남아 있습니다 (`route.ts:165-170`). e2e 는 실제 백엔드 계약이 `200` 임을 검증해야 합니다.
- **기존 `POST /api/student/reset` 의 정확한 wipe 범위**: 이 엔드포인트가 사용자 레벨 연동 플래그까지 false 로 내리는지, 아니면 학사 데이터·target_gpa 만 지우고 연동 플래그는 유지하는지 — FE 코드는 이 엔드포인트를 호출하지 않아 범위를 확인할 수 없습니다 (`Student.ts:52`).
- **linked 방향 seed/re-link primitive 존재 여부**: `isPortalLinked:true` + 정상 스냅샷(`reconnectionRequired:false`) 을 복원하는 백엔드 수단이 있는지. 현재 FE 계약상 재연동은 실제 `POST /portal/link` 스크래핑 성공(비결정적)뿐입니다.
- **linked role 의 `target_gpa` 정책**: 고정 baseline 으로 설정할지 unset 으로 둘지 — `/target-score` 퍼널 단계를 검증하는지(unset → 퍼널 노출)와 `/main` 랜딩(설정됨 → 스킵) 중 무엇을 테스트하는지에 따라 결정.
- **reset 엔드포인트의 계정 식별 방식**: bearer accessToken(per-user)으로 식별할지, `{role}` path 가 고정 시드 계정을 매핑할지.
- **portal-link job 정리 방식**: FE 에는 job get-by-id 만 있고 list 엔드포인트가 없어(`PortalLink.ts:71, 88`), 하네스가 job 을 열거해 정리할 수 없습니다. **백엔드가 userId 기준으로 서버 사이드에서 job 을 purge** 해야 합니다.
- **A-2 옵션 중 채택안 결정**: env-gated 발급 엔드포인트(1) / CI secret 회전(2) / seed 스크립트(3) 중 어느 방식으로 갈지, 그리고 (2) 선택 시 토큰 회전 주기·책임자.
- **e2e 환경의 백엔드 origin & FE 서버 기동**: `getApiBaseUrl()` 가 가리키는 백엔드를 실 백엔드로 둘지 mock 으로 둘지(`src/config/environment`). 실 백엔드면 위 토큰/리셋 협조가 전제이고, mock 이면 `/api/users/me`·`/api/users/analytics-id`·`/api/auth/refresh` stub 이 필요합니다. 어느 쪽이든 **FE Next.js 라우트 핸들러가 도는 same-origin 서버 인스턴스가 e2e 환경에 기동**되어 있어야 익스체인지가 동작합니다.
- **`SESSION_SECRET` 주입**: e2e 테스트 서버 인스턴스에 `ENV.SESSION_SECRET` 이 주입되어야 seal/unseal 이 동작합니다 (`src/lib/auth/session.ts:20`).