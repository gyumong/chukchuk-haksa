import { expect, test } from '@playwright/test';

// Phase 0 smoke — 인프라(설정·러너·webServer)가 동작하는지 검증하는 최소 테스트.
// 인증/백엔드 불필요: 앱 루트가 응답하고 기본 셸이 렌더되는지만 본다.
// 실제 기능 시나리오는 Phase 1+ 에서 인증 fixture 도입 후 추가한다.
test.describe('smoke', () => {
  test('홈(/)이 2xx 로 응답한다', async ({ page }) => {
    const response = await page.goto('/');
    expect(response, 'navigation response 가 존재해야 한다').not.toBeNull();
    expect(response?.ok(), `예상치 못한 상태코드: ${response?.status()}`).toBe(true);
  });

  test('document title 이 채워져 렌더된다', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/.+/);
  });
});
