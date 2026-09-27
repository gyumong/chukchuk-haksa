# e2e-ai (reticulum) — Playwright 실패를 AI가 질의하는 구조화 데이터로

> 상태: **도입 (2026-09-19).** 첫 실제 대상: `e2e/tests/transfer-graduation.spec.ts`.
> 도구 저장소: `workfile/reticulum/reticulum` (README / Design.md 참고). 관련 문서: `playwright-e2e-plan.md`

## 무엇을 하는가

실패한 Playwright 테스트의 `trace.zip` 을 로컬 `.e2e-ai/` 에 색인하고, MCP 서버로 노출한다.
에이전트(Claude Code / Copilot)는 trace viewer 를 사람이 열어 보는 대신 다음처럼 질의한다.

```
get_failure({ session: "latest" })        # 무엇이 왜 깨졌는지 + 파일:줄 + 직전 콘솔/네트워크 실패
list_steps({ session: "latest" })         # 타임라인 (✓/✗, 소요시간, [n console errors, m failed requests])
explain_locator({ session: "latest", step: 33 })
                                           # "셀렉터 문제가 아니다 — 요소가 DOM 에 없었다" 를 근거와 함께
get_network({ session: "latest", urlPattern: "language-cert" })
```

핵심은 마지막 두 개다. 셀렉터를 추측으로 고치기 전에 **"요소가 없었던 이유"** 를 먼저 보게 한다.

### 첫 적용 사례 (2026-09-19)

`transfer-graduation.spec.ts` 의 마지막 단언(`외국어인증제도` 노출)이 실패 →
`explain_locator` = `matchCount: 0`(DOM 에 없음) + `get_network(urlPattern: "language-cert")` = 응답 없음(-1).
→ 셀렉터가 아니라 실제 dev 백엔드 `language-cert/requirement` 가 합성 계정에 응답하지 않아 Suspense 상태였던 것.
편입생 기능과 무관한 환경 의존 단언이라 스펙에서 제거.

## 설정 (이미 반영됨)

| 항목                 | 위치                     | 내용                                                                                                |
| -------------------- | ------------------------ | --------------------------------------------------------------------------------------------------- |
| trace 기록           | `playwright.config.ts`   | 로컬 `trace: 'on'` (retries=0 이라 `on-first-retry` 로는 안 남음). CI 는 기존 `on-first-retry` 유지 |
| Claude Code MCP      | `.mcp.json`              | `e2e-ai` stdio 서버. 경로는 `E2E_AI_HOME` env, 기본값 `../../reticulum/reticulum`                   |
| VSCode / Copilot MCP | `.vscode/mcp.json`       | 같은 서버. `E2E_AI_HOME` env 필요                                                                   |
| 비밀 보호            | `.gitignore` `/.e2e-ai/` | 색인엔 토큰·쿠키·응답 본문이 들어감(저장 시 리댁션되지만 커밋 금지)                                 |

reticulum 이 다른 경로에 있으면 `E2E_AI_HOME` 을 그 저장소 루트로 지정한다 (PowerShell: `$env:E2E_AI_HOME = 'C:\...\reticulum'`).

## 사용 흐름

```bash
# 1) 테스트 실행 — 실패하면 test-results/**/trace.zip 이 남는다 (성공도 남음: trace 'on')
yarn e2e --project=chromium-web e2e/tests/transfer-graduation.spec.ts

# 2) 색인 (반드시 이 저장소 루트에서 실행 — 아래 '알려진 이슈' 참고)
node ../../reticulum/reticulum/packages/trace-parser/dist/cli.js --latest   # 최근 것만
node ../../reticulum/reticulum/packages/trace-parser/dist/cli.js            # 전부

# 3) 사람이 읽는 요약
cat .e2e-ai/sessions/*/report.md

# 4) 에이전트 — Claude Code 는 .mcp.json 의 e2e-ai 서버를 승인하면 get_failure 등을 바로 쓸 수 있다.
```

테스트가 없는 버그는 **attach 모드**: 사람이 브라우저에서 재현하고 AI 가 그 세션을 본다.

```bash
node ../../reticulum/reticulum/packages/attach/dist/cli.js --url http://localhost:3000
# 다른 터미널에서
node ../../reticulum/reticulum/packages/attach/dist/cli.js fail "여기서 깨짐"
node ../../reticulum/reticulum/packages/attach/dist/cli.js stop
```

## 리댁션

`.e2e-ai/` 저장 시점에 JWT · `Authorization`/`Cookie` 헤더 · 토큰성 쿼리 · 이메일/전화/주민번호 · `password`/`secret` 류가
`<redacted:jwt>` 같은 타입 힌트로 치환된다 (첫 색인에서 64건 치환 확인: cookie×48, authorization×8, set-cookie×3, rrn×3, jwt×2).
학번(`studentCode`)은 기본 규칙에 없다 — 실제 학생 계정으로 재현하는 경우 `.e2e-ai/redact.json` 에 규칙을 추가할 것:

```json
{ "rules": [{ "name": "student-code", "pattern": "\\b(19|20)\\d{6}\\b" }] }
```

## 알려진 이슈 (reticulum 쪽)

- `trace-parser` CLI 의 `--workspace <dir>` — 값(`.`)이 positional(trace 파일)로 새서 `EISDIR` 로 실패한다.
  우회: 이 저장소 루트에서 `--workspace` 없이 실행(cwd 기본값). 수정 지점: `packages/trace-parser/src/cli.ts` 의 `explicit` 필터가 플래그 값을 제외해야 함.
- `get_step(include: ['screenshot'])` 가 Playwright 1.61 trace 에서 스텝별 스크린샷을 찾지 못함(`(none recorded)`). README "스크린샷 다운스케일 — 부분" 항목과 연관.
- `get_network` 의 status `-1` 은 "응답이 기록되지 않음(미완료/중단)" 인데 설명이 없다 — 위 첫 사례처럼 해석에 쓰이므로 응답에 힌트가 있으면 좋겠다.
- Node 20 에서도 동작(`better-sqlite3` 네이티브 로드 성공). README 요구 22.5+ 는 `node:sqlite` 폴백 기준.
