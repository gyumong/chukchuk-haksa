// Phase 1 — 인증 핵심 흐름.
// loginAs(POST /api/session 익스체인지) 기반. 실제 카카오 OAuth는 자동화하지 않는다(계획 §C).
import { expect, test } from '../fixtures/auth';

// requirePortalLinked 보호 페이지 (src/app/(main)/main/layout.tsx).
// 미연동 → portalLinkRedirectTo = '/portal-login' / 비로그인 → redirectTo 기본값 '/'.
// 리다이렉트 후 목적지 페이지에도 "수원대학교" 헤더가 있으므로, 콘텐츠가 아니라 URL 로 판정한다.
const PROTECTED = '/main';

test.describe('인증 게이트', () => {
  test('비로그인 사용자가 보호 페이지에 접근하면 보호 페이지에서 벗어난다', async ({ page }) => {
    await page.goto(PROTECTED);
    // GET /api/session 401 → accessToken null → useAuthCheck 가 redirectTo('/')로 replace.
    await page.waitForURL(url => new URL(url).pathname !== PROTECTED, { timeout: 15_000 });
    await expect(page).not.toHaveURL(/\/main(?:[/?#]|$)/);
  });

  test('미연동 사용자는 포털 연동 페이지(/portal-login)로 보내진다', async ({ page, loginAs }) => {
    await loginAs('unlinked');
    await page.goto(PROTECTED);
    // isPortalLinked=false → ProtectedRoute(requirePortalLinked) → portalLinkRedirectTo('/portal-login').
    await page.waitForURL(url => new URL(url).pathname === '/portal-login', { timeout: 15_000 });
  });

  test('연동 사용자는 보호 페이지에 머문다', async ({ page, loginAs }) => {
    await loginAs('linked');
    await page.goto(PROTECTED);
    await expect(page).toHaveURL(/\/main(?:[/?#]|$)/);
    await expect(page.getByText('수원대학교')).toBeVisible();
  });

  test('로그아웃하면 세션이 제거된다', async ({ context, loginAs }) => {
    await loginAs('linked');

    const del = await context.request.delete('/api/session');
    expect(del.status()).toBe(200);

    const after = await context.request.get('/api/session');
    expect(after.status(), '로그아웃 후 GET /api/session 은 401 이어야 함').toBe(401);
  });

  test('유효한 세션은 refresh로 새 accessToken을 받는다', async ({ context, loginAs }) => {
    await loginAs('linked');

    const refreshed = await context.request.post('/api/session/refresh');
    expect(refreshed.status(), `POST /api/session/refresh 200 기대: ${refreshed.status()}`).toBe(200);
    const body = (await refreshed.json()) as { accessToken?: string };
    expect(typeof body.accessToken).toBe('string');
    expect((body.accessToken ?? '').length).toBeGreaterThan(0);
  });
});
