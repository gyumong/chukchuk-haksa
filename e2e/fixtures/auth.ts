// 인증 fixture — 계획 §C "POST /api/session 토큰 익스체인지" 방식.
//
// loginAs(role): (1) Admin API로 role에 맞는 테스트 계정을 생성해 ac/re 토큰을 받고,
//                (2) same-origin POST /api/session 으로 cchaksa_session 쿠키를 브라우저 컨텍스트에 심는다.
// 매 호출마다 새 계정을 만들기 때문에 토큰 만료/회전 문제가 없다.
import { test as base, type BrowserContext, expect } from '@playwright/test';
import { createTestUser, type Role, type TestUser } from './admin';
import { SESSION_COOKIE } from './config';

export interface SessionState {
  accessToken: string;
  isPortalLinked: boolean;
  analyticsId: string | null;
}

// 응답 바디는 정확히 1회만 읽는다(중복 read 회피). 비JSON(예: dev 서버 500 HTML)이면 명확한 에러로 표면화.
function parseJson<T>(text: string, label: string): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`${label} 응답이 JSON 이 아님: ${text.slice(0, 200)}`);
  }
}

// 토큰을 same-origin /api/session 으로 교환해 세션 쿠키를 심는다.
// 성공 판정: POST 200 + Set-Cookie(cchaksa_session) + GET /api/session 200.
// (POST 200만으론 불충분 — route.ts 는 indeterminate probe에도 200 {ok:true}를 줄 수 있다.)
export async function exchangeSession(
  context: BrowserContext,
  tokens: { accessToken: string; refreshToken: string }
): Promise<SessionState> {
  const post = await context.request.post('/api/session', { data: tokens });
  const postText = await post.text();
  expect(post.status(), `POST /api/session 200 기대: ${post.status()} ${postText}`).toBe(200);
  const postBody = parseJson<{ ok?: boolean }>(postText, 'POST /api/session');
  expect(postBody.ok, 'POST /api/session 응답이 { ok: true } 여야 함').toBe(true);

  const cookies = await context.cookies();
  expect(
    cookies.some(c => c.name === SESSION_COOKIE),
    `${SESSION_COOKIE} 쿠키가 설정돼야 함`
  ).toBe(true);

  const get = await context.request.get('/api/session');
  const getText = await get.text();
  expect(get.status(), `GET /api/session 200 기대: ${get.status()} ${getText}`).toBe(200);
  return parseJson<SessionState>(getText, 'GET /api/session');
}

interface AuthFixtures {
  // role에 맞는 테스트 계정을 만들고 세션을 수립한 뒤, 후속 시딩에 쓸 계정 정보를 돌려준다.
  loginAs: (role: Role) => Promise<TestUser>;
}

export const test = base.extend<AuthFixtures>({
  // 두 번째 인자는 Playwright 의 fixture provider. 이름이 `use` 면 react-hooks 규칙이 오탐하므로 `provide` 로 둔다.
  loginAs: async ({ context }, provide) => {
    await provide(async (role: Role) => {
      const user = await createTestUser({ role });
      const state = await exchangeSession(context, {
        accessToken: user.accessToken,
        refreshToken: user.refreshToken,
      });
      expect(
        state.isPortalLinked,
        `loginAs('${role}') 세션의 isPortalLinked 가 ${role === 'linked'} 여야 함 ` +
          `(불일치 시 admin test-users 의 연동 플래그 반영 여부 확인)`
      ).toBe(role === 'linked');
      return user;
    });
  },
});

export { expect, SESSION_COOKIE };
