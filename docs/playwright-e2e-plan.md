# Playwright E2E 자동화 — 계획 문서

> 상태: **결정안 반영 (2026-05-31).** §9 에 코드 조사 기반 결정/추천 정리.
> Phase 0 은 백엔드 무관 즉시 착수 가능, Phase 1+ 는 백엔드 협조(테스트 계정 토큰·reset) 필요.
> 관련 문서: `bff-auth-refactor.md` (인증·세션 정책)

## 목적

수동 회귀 테스트의 한계를 자동화로 보완한다. 특히 다음 류의 버그를 PR 시점에 잡는 것을 1차 목표로 한다:

- **인증/세션 race** — 새로고침 시 토큰 hydration 전 보호 페이지 query 발사로 A05 노출 (PR #201 류)
- **iOS WKWebView 케이스** — Chromium 에선 자동 retry 로 가려지는 stale connection 등 WebKit 전용 회귀 (Sentry CCHAKSA-56 류)
- **portal-link 흐름 중단** — scraping job 폴링·성공·실패·타임아웃 분기
- **MPA WebView 핸드오프** — `POST /api/session` 익스체인지 → bridge 메시지 송출
- **유지보수성** — `yarn api:update` 부수효과로 인한 호출부 회귀 (`.data.X → .X` 같은 평탄화)

수동 검증으로 잡기 어렵거나 빈번히 놓치는 영역을 우선순위로 둔다 — 100% 커버리지 목표 아님.

## 범위 — Phase 별 롤아웃

각 Phase 는 독립적으로 머지 가능. CI 게이트 적용은 Phase 2 이후 (안정화 후 활성).

### Phase 0 — 인프라
- `@playwright/test` 설치, 설정 파일, smoke test 1개 (`/` → 200 응답)
- `e2e/` 디렉토리 + `playwright.config.ts`
- `yarn e2e` / `yarn e2e:ui` / `yarn e2e:headed` 스크립트
- GitHub Actions 워크플로 (PR 마다 실행, 결과 코멘트)

### Phase 1 — 인증 핵심 흐름
- 로그인 (Kakao OAuth → AuthContext hydration → analyticsId 채워짐)
- 로그아웃 (`DELETE /api/session` → resetAnalytics → 익명 device_id 발급 검증)
- 세션 만료 → refresh 자동화 → 성공/실패 분기
- 보호 페이지 직접 접근 시 redirect

### Phase 2 — 보호 페이지 새로고침 (PR #201 회귀 방어)
- `/main`, `/academic-detail?year=Y&semester=S`, `/graduation-progress` 새로고침 N회 반복
- A05 / "인증이 필요" 노출 미발생 확인
- AuthContext hydration 전 query 발사 race 검증

### Phase 3 — portal-link funnel (첫 연동)
- `/portal-login` → 학번/비번 입력 → `/scraping` → polling → `/agreement` → `/complete` → `/target-score`
- 실패 분기: 자격증명 오류 / 시스템 오류 / 타임아웃
- 재시도 흐름 (`credentialRetry`)

### Phase 4 — 재연동 (resync)
- 홈에서 "갱신하기" 탭 → `/resync/login` → submit → `/resync/scraping` → succeeded → `/main`
- MPA twin (`/mpa/resync/login` → `/mpa/resync/scraping`)

### Phase 5 — MPA WebView 시뮬레이션
- `window.ReactNativeWebView` 모킹 → `(mpa)` 라우트 진입
- `POST /api/session` 토큰 익스체인지 → cchaksa_session 발급
- 학교 연동 완료 시 `postBridgeMessage('done:portal-link')` 송출 확인
- 신입생 skip 흐름 (`skip:portal-link` bridge)

### Phase 6 — 회귀 방어 보강 (선택)
- 시각 회귀 (visual regression) — 핵심 페이지 스냅샷 비교
- 접근성 체크 (`@axe-core/playwright`) — 보호 페이지 a11y 회귀

## 기술 선택

| 항목 | 결정 | 비고 |
|---|---|---|
| 프레임워크 | `@playwright/test` | Vitest 와 분리. Playwright 의 fixture/parallel 그대로 활용 |
| 언어 | TypeScript | 코드베이스와 일관 |
| 브라우저 | Chromium 기본 + WebKit | WebKit 은 iOS WKWebView 회귀 (Sentry CCHAKSA-56 류) 위해. Firefox 는 제외 (사용자 모집단 작음) |
| 디렉토리 | `e2e/` (프로젝트 루트) | 단위 테스트 (`__tests__/`) 와 분리 |
| 보고서 | HTML + GitHub Actions summary | 실패 시 스크린샷/비디오/trace 자동 캡쳐 |

## 테스트 환경

| 실행 위치 | 대상 | 용도 |
|---|---|---|
| 로컬 (`yarn e2e`) | `localhost:3000` + dv backend | 개발 중 디버그 |
| CI (PR) | Cloudflare Workers preview (또는 자체 띄움) | 머지 게이트 |
| Smoke (post-merge) | `dv.cchaksa.com` | 배포 직후 회귀 감지 |
| prod 미적용 | — | prod 데이터 오염 방지 — Phase 6 까지도 prod 대상 e2e 는 안 함 |

**TBD**: Vercel preview / Cloudflare 미리보기 / 자체 띄움 중 어느 환경에서 CI 실행할지 (§9 참조).

## 인증 처리 — 핵심 의사결정

Kakao OAuth 는 진짜 사용자 입력 흐름이라 자동화 까다로움 (recaptcha, anti-bot). 4가지 옵션 비교:

| 옵션 | 방식 | 장점 | 단점 |
|---|---|---|---|
| **A. 실제 카카오 테스트 계정** | Playwright 가 카카오 페이지 자동 입력 → 콜백 통과 | 진짜 흐름 그대로 | 카카오 UI 변경에 취약, anti-bot 차단 가능, 느림 |
| **B. 백엔드 테스트 전용 로그인 엔드포인트** | `POST /api/test/login` 같은 별도 endpoint 가 ac/re 직접 반환 | 가장 안정적, 빠름 | 백엔드 협조 필요, prod 노출 위험 (env gate 필요) |
| **C. `POST /api/session` 토큰 익스체인지** ⭐ | 미리 시드된 테스트 계정의 ac/re 를 `POST /api/session` 으로 cchaksa_session 쿠키 생성 | FE 측 변경 0 (이미 MPA 용으로 존재), 백엔드 변경 최소 (ac/re 발급 절차만) | ac/re 토큰 시드 운영 (만료 시 갱신) |
| **D. 디버그 훅 (`__debugAccessToken`)** | 개발 중 사용한 localStorage 오버라이드 | 즉시 가능 | prod 빌드엔 없으므로 e2e 환경엔 안 맞음 |

**추천: C.** `POST /api/session` 익스체인지 endpoint 가 이미 존재 (`src/app/api/session/route.ts`). 백엔드 협조는 테스트 계정 ac/re 발급 절차만 필요. Playwright fixture 로 `loginAs(role)` helper 제공.

```ts
// e2e/fixtures/auth.ts (예시)
import { test as base } from '@playwright/test';

type AuthFixtures = {
  loginAs: (role: 'linked' | 'unlinked') => Promise<void>;
};

export const test = base.extend<AuthFixtures>({
  loginAs: async ({ page, request }, use) => {
    await use(async (role) => {
      const tokens = await fetchTestTokens(role); // 백엔드 또는 환경변수에서
      const res = await request.post('/api/session', {
        data: { accessToken: tokens.access, refreshToken: tokens.refresh },
      });
      // cchaksa_session 쿠키 자동 적용됨
    });
  },
});
```

**TBD**: 테스트 계정 ac/re 토큰의 시드 방식 (백엔드 endpoint vs CI secret vs 운영팀 발급 키 회전) — §9 참조.

## 데이터 시드 / 정리

테스트마다 사이드 이펙트가 누적되면 안 됨:
- portal-link job 생성 → 실패 시 retry stash
- 학교 연동 성공 → `isPortalLinked: true` 승격
- 목표 학점 설정 → `student.target_gpa`

### 옵션
| 옵션 | 방식 | 비고 |
|---|---|---|
| 백엔드 reset endpoint | `POST /api/test/reset/{role}` | 백엔드 협조 필요 |
| 테스트 격리 모드 | 백엔드가 e2e 헤더 인식 시 in-memory / sandbox 모드 | 가장 깔끔하지만 백엔드 작업 큼 |
| 테스트 후 수동 정리 | afterEach 에서 fixture 가 reset API 호출 | reset endpoint 전제 |

**TBD**: 백엔드와 어느 정도까지 협조 가능한지 — §9 참조.

## 파일 구조 (제안)

```
e2e/
  playwright.config.ts          # 환경별 projects (chromium / webkit / mpa-mock)
  fixtures/
    auth.ts                     # loginAs(role) — POST /api/session 익스체인지
    seed.ts                     # 테스트 데이터 시드/정리
    mpaBridge.ts                # window.ReactNativeWebView 모킹
  utils/
    waitForHydration.ts         # AuthContext isReady 까지 대기
  tests/
    smoke.spec.ts               # Phase 0
    auth.spec.ts                # Phase 1
    protected-pages.spec.ts     # Phase 2
    portal-link-funnel.spec.ts  # Phase 3
    resync.spec.ts              # Phase 4
    mpa.spec.ts                 # Phase 5
    visual.spec.ts              # Phase 6 (선택)
```

`playwright.config.ts` projects 분리:
- `chromium-web` — 일반 웹 시나리오
- `webkit-web` — iOS Safari 회귀
- `mpa-mock` — `(mpa)` 라우트, WebView API 주입

## CI 통합

### 트리거
- PR 열림/업데이트
- `push` to `dev` (post-merge 회귀)

### 머지 게이트 (점진 적용)
- Phase 0~1 머지 후: 정보 제공 (실패해도 머지 가능)
- Phase 2 안정화 후: 핵심 시나리오 필수 (실패 시 머지 차단)
- Phase 3~5 안정화 후: 전체 필수

### Artifacts
- 실패 시 스크린샷 (각 실패 step)
- 비디오 (실패한 spec 전체)
- Playwright trace (시간순 step + network)
- HTML 리포트

### 비용/시간 관리
- 병렬화: Playwright 기본 worker 자동 분배
- Sharding 필요 시 GitHub Actions matrix 로 4-way split
- WebKit 은 핵심 시나리오만 (Phase 1, 2) → CI 시간 절감
- 시각 회귀는 PR 라벨 (`run-visual`) 있을 때만 — 평시 skip

## 미해결 결정 사항 — 코드 조사 후 결정안 (2026-05-31)

> 코드베이스 조사로 아래와 같이 결정/추천. **#3·#5·#6·#7·#8 은 본인 단독 확정 가능, #1·#2·#4 만 백엔드 협조 필요.**

| # | 항목 | 결정자 | 결정안 (근거) |
|---|---|---|---|
| 1 | 인증 자동화 방식 (A/B/C/D 중) | 본인 + 백엔드 | **C — `POST /api/session` 토큰 익스체인지.** endpoint 이미 구현(`src/app/api/session/route.ts:217-255`) → FE 변경 0. 옵션 B/D 는 소스에 부재(문서에만 존재), 토큰은 in-memory `tokenStore` 라 클라 주입 불가, A 는 카카오 외부 UI 의존으로 flaky |
| 2 | 테스트 계정 ac/re 토큰 시드 방식 | 본인 + 백엔드 | **백엔드 발급 → CI secret 주입.** C 의 유일 전제. 만료 시 회전 절차 필요 |
| 3 | CI 실행 환경 | 본인 | **CI 러너 자체 기동(`next build`+`next start`) + dv 백엔드.** CF preview 파이프라인 부재(deploy=push 전용, env=staging/prod 2종), `environment.ts` 가 미지정 시 `dev.api.cchaksa.com` fallback. Playwright `webServer` 로 기동. Workers 런타임 회귀는 post-merge smoke(`dv.cchaksa.com`)로 보완 |
| 4 | 데이터 reset 전략 | 본인 + 백엔드 | **백엔드 reset endpoint(env-gated) + `afterEach`.** `isPortalLinked` 가 probe 로만 승격돼 쿠키 삭제로 안 풀림 → Phase 3(unlinked)·4(linked) 양방향 리셋 필요. 범위: `isPortalLinked` 토글 / `target_gpa` 초기화 / 미완료 job 정리 (세션·sessionStorage 는 browser context 격리로 자동) |
| 5 | 머지 게이트 시점 | 본인 + 팀 | **Phase 2 안정화 후 required 승격.** 현재 PR 게이트는 autofix 뿐 → 조기 required 시 flaky 가 전 PR 차단. 승격은 branch protection 설정(레포 admin) 작업 |
| 6 | WebKit 포함 범위 | 본인 | **Phase 1·2 핵심 시나리오만.** bridge 가 `addInitScript` 로 모킹 가능(outbound 전용), WKWebView 회귀(CCHAKSA-56류) 가치 있으나 CI 시간 절감 |
| 7 | 시각 회귀 / a11y 도입 시점 | 본인 | **Phase 6 또는 별도 트랙** (후순위) |
| 8 | Playwright Cloud (Microsoft) 사용 여부 | 본인 | **초기 skip** — GH Actions 러너로 충분 |

### 백엔드/운영팀 협조 요청 (1건으로 통합)

> e2e 테스트 계정 **2개(연동/미연동)** 에 대해 — (a) 유효한 ac/re 토큰을 받을 방법, (b) 상태 초기화 env-gated reset endpoint (`POST /api/test/reset/{role}` 등).

### 착수 순서 (백엔드 대기 없이 시작)

- **Phase 0** (smoke + 인프라) — 인증·백엔드 **불필요** (`/` → 200). #3·#6·#8 확정만으로 즉시 착수.
- **Phase 1·2** (인증·보호페이지 새로고침) — #1·#2(테스트 계정 토큰) 필요. read-only 라 reset 불필요.
- **Phase 3~5** (연동 funnel·resync·MPA) — 추가로 #4(reset) 필요.

## 참고 자료

- Playwright 공식 문서: https://playwright.dev/
- iron-session: https://github.com/vvo/iron-session — `POST /api/session` 익스체인지 동작 이해용
- Sentry CCHAKSA-56 — WebKit stale connection retry 회귀
- 관련 코드 참조:
  - `src/app/api/session/route.ts` — 토큰 익스체인지 (e2e 인증 핵심)
  - `src/features/auth/contexts/AuthContext.tsx` — hydration 흐름 (race 검증 타겟)
  - `src/lib/webview/bridge.ts` — WebView 브릿지 모킹 대상

## 후속 작업 흐름

1. 이 문서의 §9 TBD 확정 (본인 + 백엔드 1회 회의)
2. Phase 0 PR (이 브랜치 위에 추가) — 인프라 + smoke test
3. Phase 1 PR — 인증 fixture + 핵심 시나리오
4. Phase 2 PR — 보호 페이지 새로고침 검증 (PR #201 회귀 방어)
5. 그 외 Phase 는 시급도 따라 순차

각 Phase 별 PR 은 5-10 파일 규모로 유지 — 리뷰 부담 분산.
