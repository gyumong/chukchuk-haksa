# MPA 학교 인증 웹링크 — 백엔드/모바일 핸드오프

> 관련 문서: `bff-auth-refactor.md` (cchaksa_session 정책), `webview-mpa-request-response.md` (MPA/네이티브 브릿지 정렬)
> 프론트 변경: 본 문서 작성 시점 기준 머지 대기

## 배경

척척학사 모바일 앱(Compose Multiplatform)은 신규 가입 사용자가 학교 인증 없이도 시간표 등 일부 기능을 사용할 수 있도록 설계되어 있다. 사용자가 나중에 학교 인증을 진행할 때, **앱이 학교 인증 화면을 webview 로 띄워** 기존 웹의 `portal-link` 흐름을 그대로 재활용한다.

문제: 모바일 앱은 카카오 SDK 로 직접 로그인하여 백엔드의 `accessToken` / `refreshToken` 만 보유한다. 웹의 모든 인증 API 는 `cchaksa_session` (iron-session 으로 sealData 된 HttpOnly 쿠키) 을 요구하며, 이 쿠키는 `SESSION_SECRET` 을 가진 서버만 만들 수 있다. 즉 **앱이 들고 있는 토큰을 BFF 가 cchaksa_session 으로 익스체인지해주는 경로가 필요**하다.

## 호출 시퀀스 (목표 상태)

```text
앱 (ac/re 보유, cchaksa_session 없음)
  │
  ├─ ① POST /api/session
  │     body: { accessToken, refreshToken }
  │     (isPortalLinked 는 서버가 항상 false 로 강제. 요청 바디에서 받지 않음)
  │  └─ BFF: sealData → Set-Cookie: cchaksa_session
  │
  ├─ ② WebView open  /mpa/resync/login
  │  └─ (mpa) layout 의 ProtectedRoute → GET /api/session → 200 OK → 폼 렌더
  │
  ├─ ③ 사용자 학번/비번 입력 → portal-link job 생성
  │  └─ router.push(/mpa/resync/scraping)
  │
  ├─ ④ scraping 페이지 폴링 → succeeded
  │  └─ postBridgeMessage('done:portal-link')
  │
  └─ ⑤ 네이티브: webview 닫고 dashboard 갱신
```

## 운영 결정 (2026-05-05): 시크릿 게이트 폐기

`x-native-bridge-secret` 헤더 게이트와 `NATIVE_SESSION_EXCHANGE_SECRET` 환경변수는 **코드에서 제거**했다 (`src/app/api/session/route.ts`, `src/config/environment.ts`). 모바일 측은 이 헤더를 부착할 필요가 없고, 인프라 측은 시크릿을 공유·등록할 필요가 없다. 위조 토큰 차단은 백엔드 토큰 진위 검증(B1) 단독 책임으로 통합된다.

**근거**
- 시크릿이 모바일 바이너리에 박혀 디컴파일·정적 분석으로 곧바로 추출 가능 → 보안 효용 제한적
- 위조 토큰의 실질 방어선은 어차피 B1. 게이트가 있어도 B1 이 들어오면 중복 방어가 됨
- 모바일·인프라 양쪽에 시크릿 공유·회전 절차 부담을 강제하기엔 1차 출시 시급도 대비 비용이 큼

**B1 도입 전까지의 노출 면**
- `POST /api/session` 은 임의의 ac/re 토큰을 그대로 봉인 → 위조 호출 시 쓰레기 cchaksa_session 발급 가능 (백엔드 호출은 401 로 차단되지만 쿠키 자체는 30일 유효)
- `isPortalLinked` 는 요청 바디에서 받지 않고 항상 `false` 강제 → 위조 호출이 portal-link 통과 상태로 세션 승격하는 경로 차단. 실제 연동 상태는 재로그인(auth callback) 또는 백엔드 me/profile 응답으로만 갱신
- 발급 시점 CSRF 1차 보호: HTTPS + JSON 본문 요구 + same-origin/CORS 로 외부 페이지의 자동 POST 차단. (SameSite=Lax / HttpOnly 는 *발급된* cchaksa_session 의 후속 보호이지 발급 시점 방어선이 아님 — 서버측 `Origin` 헤더 검증 추가는 후속 강화 트랙)

**재도입 트리거** (필요 시 git history 에서 게이트 코드 복원)
- 익명·봇 트래픽이 `POST /api/session` 을 무차별 호출하는 패턴 관측
- B1 도입이 장기 지연되어 위조 차단 수단이 부재한 상태 지속

## 프론트(웹) 작업 — 본 PR 에 포함

| 변경 | 파일 | 비고 |
|---|---|---|
| `POST /api/session` 익스체인지 추가 | `src/app/api/session/route.ts` | ac/re → cchaksa_session sealing. 토큰 진위 검증은 B1 (백엔드 의존) |
| `ROUTES.MPA.RESYNC_SCRAPING` 추가 | `src/constants/routes.ts` | `/mpa/resync/scraping` |
| `/mpa/resync/login` 페이지 신설 | `src/app/(mpa)/mpa/resync/login/page.tsx` | 기존 `/resync/login` 흐름 mpa 컨텍스트로 복제. 성공 시 `/mpa/resync/scraping` 이동 |
| `/mpa/resync/scraping` 페이지 신설 | `src/app/(mpa)/mpa/resync/scraping/page.tsx` | succeeded 시 `isInWebView()` 분기: webview 면 `postBridgeMessage('done:portal-link')`, 아니면 `/main` fallback. 에러/타임아웃은 throw 대신 `ErrorScreen` 인라인 렌더 |

`(mpa)` route group layout 은 `ProtectedRoute(requirePortalLinked=false)` 이므로, 학교 인증 전(=신규 사용자) 상태에서도 페이지 접근 가능.

## 백엔드 팀 요청

### B1. 토큰 진위 검증 엔드포인트 (필수)

현재 `POST /api/session` 은 앱이 보낸 `accessToken`/`refreshToken` 을 진위 검증 없이 그대로 sealData 한다. 위조 토큰으로 임의의 cchaksa_session 발급이 가능한 상태(쿠키만 30일 유효, 백엔드 호출은 어차피 401 로 막히지만 쿠키 자체가 쓰레기로 남음).

해결안 두 가지 중 택일:

- **(권장) `POST /api/auth/verify`** — body 의 accessToken 이 백엔드가 발급한 유효 토큰인지 확인하고 `200 OK { isPortalLinked }` 또는 `401` 반환. 부작용 없음(토큰 회전 안 됨)
- **(차선) `GET /api/users/me` 같은 가벼운 인증 필수 GET 엔드포인트** — BFF 가 익스체인지 직전 호출해서 200 떨어지면 진위 OK 로 간주

이 엔드포인트가 추가되면 `src/app/api/session/route.ts` 의 `POST` 핸들러에서 sealData 직전 호출하도록 `TODO(backend)` 주석을 풀어 구현한다.

### B2. (옵션) 짧은 TTL 의 session-init token

Auth0 의 *Native to Web SSO* 가 사용하는 패턴. 앱이 ac/re 토큰 자체 대신 짧은 TTL(예: 60초) 1회용 세션 초기화 토큰을 받아서 BFF 에 넘기는 형태. 네트워크 캡처/로그 노출 시 재사용 위험을 낮춘다. **B1 으로도 1차 차단은 충분하므로 시급도는 낮음.**

## 모바일(Compose Multiplatform) 팀 요청

### M1. iOS WKAppBoundDomains 등록 (필수)

iOS 14+ 의 ITP(Intelligent Tracking Prevention) 가 app-bound 로 등록되지 않은 도메인의 쿠키를 강등시킨다. 우리가 발급하는 `cchaksa_session` 의 30일 maxAge 가 사실상 무력화되어 webview 진입마다 재익스체인지가 필요해진다.

`Info.plist`:

```xml
<key>WKAppBoundDomains</key>
<array>
  <string>cchaksa.com</string>
  <!-- staging 도메인도 별도 등록. 최대 10 개 제한 -->
</array>
```

`WKWebView` 설정에 `limitsNavigationsToAppBoundDomains = true` 권장. 등록은 런타임 변경 불가, 앱 재설치 필요.

### M2. JS Bridge 인터페이스 합의 (필수)

웹 측 핸들러(`src/lib/webview/bridge.ts`) 가 다음 세 가지를 자동 감지한다. 모바일이 어느 형태로 노출하든 한 가지만 충족하면 동작.

| 플랫폼 | 노출 형태 | 비고 |
|---|---|---|
| RN/유사 | `window.ReactNativeWebView.postMessage(string)` | RN 표준 |
| iOS WKWebView | `window.webkit.messageHandlers.bridge.postMessage(string)` | 핸들러 이름이 `bridge` 이어야 함 (필수) |
| Android | `window.Android.postMessage(string)` | `addJavascriptInterface(obj, "Android")` 형태 |

**합의 필요**: iOS 의 message handler 등록 이름. 현재 코드는 `bridge` 가정. 다른 이름이면 `bridge.ts` 수정 필요.

### M3. 메시지 프로토콜 합의 (필수)

현재 웹이 송출하는 메시지 형식 (모두 `string`):

| 메시지 | 송출 위치 | 의미 |
|---|---|---|
| `navigate:<path>` | `src/lib/webview/bridge.ts` `navigateNative()` | 네이티브가 해당 path 로 화면 전환 (예: `navigate:/mpa/graduation-progress`) |
| `done:portal-link` | `/mpa/resync/scraping` succeeded 시 | 학교 인증 잡 완료. 네이티브가 webview 닫고 dashboard 등 갱신 |

**합의 필요**: `done:portal-link` 수신 시 네이티브 동작. 권장 동작:
1. webview 컨테이너 dismiss/pop
2. 직전 화면(예: 마이페이지·홈)에서 프로필/학사 정보 갱신 트리거

### M4. POST /api/session 익스체인지 호출 시점

이전 합의(세션 갱신을 앱이 책임지는 후자 방식)에 따라:

- 학교 인증 webview 진입 직전 한 번 호출 (필수)
- 이후 앱의 ac/re 토큰이 회전될 때마다 다시 호출 (선택, webview 가 살아있는 동안 401 방지)

호출 예시:

```http
POST https://cchaksa.com/api/session
Content-Type: application/json

{
  "accessToken": "<백엔드가 발급한 ac>",
  "refreshToken": "<백엔드가 발급한 re>"
}
```

응답:
- `200 { ok: true, isPortalLinked: false }` + `Set-Cookie: cchaksa_session=...`
  - `isPortalLinked` 는 항상 `false` (위조 방지). 실제 연동 상태는 백엔드 me/profile 응답으로 조회
- `400 { error: "MISSING_ACCESS_TOKEN" | "MISSING_REFRESH_TOKEN" | "INVALID_JSON" }`

### M5. 로그아웃 동기화

앱에서 로그아웃할 때 `DELETE /api/session` 호출 권장. 안 하면 cchaksa_session 쿠키만 30일 살아있는 상태가 됨. 다음 webview 진입 시 잘못된 세션으로 시작될 위험.

## 보안 고려사항

| 항목 | 현재 상태 | 완화 책임 |
|---|---|---|
| 위조 토큰으로 cchaksa_session 발급 | 게이트 폐기로 1차 차단 없음. 쓰레기 쿠키 발급은 가능하나 백엔드 호출은 401, `isPortalLinked` 는 false 강제로 세션 승격 차단 (B1 도입 시 sealData 단계에서 진위 검증) | 백엔드(B1) |
| `/api/session` POST 의 CSRF | JSON 본문 요구 + same-origin/CORS preflight 로 외부 페이지의 자동 POST 차단. SameSite/HttpOnly 는 *발급된* 쿠키의 후속 보호이지 발급 시점 방어선 아님 | 프론트(완료) → 서버측 `Origin` 검사 후속 |
| 앱 ↔ BFF 간 토큰 전송 평문 | HTTPS 필수 | 인프라 |
| WKAppBoundDomains 미등록 | iOS 쿠키 7일~24시간 후 정리 | 모바일(M1) |

## 검증 체크리스트

### 프론트 (본 PR)
- [x] `yarn type-check` 통과
- [x] `yarn lint` 통과
- [ ] 로컬에서 `POST /api/session` 호출 후 `Set-Cookie: cchaksa_session` 발급 확인 (cURL 또는 Postman)
- [ ] `/mpa/resync/login` 직접 진입 시 ProtectedRoute 동작 (세션 없으면 `/`)
- [ ] `/mpa/resync/scraping` succeeded 시 `console` 또는 bridge 모킹으로 `done:portal-link` 송출 확인

### 백엔드 (B1 구현 후)
- [ ] 위조 토큰으로 `POST /api/session` 호출 시 401
- [ ] 유효 토큰으로 호출 시 200 + 쿠키 발급
- [ ] 만료된 ac 토큰으로 호출 시 401 (refresh 자동 시도 X — 이건 별도 endpoint)

### 모바일 (M1~M5 구현 후)
- [ ] iOS: 앱 재시작 후에도 cchaksa_session 살아있음 (WKAppBoundDomains 효과 검증)
- [ ] iOS: WKWebView 에서 `window.webkit.messageHandlers.bridge` 존재
- [ ] Android: WebView 에서 `window.Android.postMessage` 호출 가능
- [ ] 학교 인증 잡 succeeded 시 webview 자동 dismiss + 프로필 갱신
- [ ] 앱 로그아웃 시 `DELETE /api/session` 호출되어 다음 webview 가 미인증 상태로 시작

## 후속 과제

- (B2) session-init token 도입 (보안 강화 트랙)
- (프론트) `done:portal-link` 외 메시지 확장 시 프로토콜 명세를 별도 파일(`docs/webview-bridge-protocol.md`) 로 분리
- (앱+웹 공동) 세션 만료 중 webview 가 살아있을 때의 처리(앞 답변의 옵션 A/B/C 중 결정) — 1차 운영 후 재논의
