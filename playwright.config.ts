import { defineConfig, devices } from '@playwright/test';

// Playwright e2e 설정 (Phase 0 — 인프라/smoke).
// 계획 문서: docs/playwright-e2e-plan.md
//
// 앱 TS 프로그램과 분리: tsconfig.json 의 exclude 에 `e2e`, `playwright.config.ts` 추가됨.
// Playwright 는 자체 로더로 트랜스파일하므로 tsc/next build 와 결합하지 않는다.
//
// 로컬: webServer 가 `yarn dev` 를 재사용/기동해 localhost:3000 을 대상으로 실행.
// CI(별도 단계에서 도입 예정)에서는 next build+start 후 실행 — reuseExistingServer=false.

const PORT = 3000;
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? `http://localhost:${PORT}`;
const IS_CI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e',
  outputDir: './test-results',
  fullyParallel: true,
  // CI 에서 실수로 test.only 가 머지되는 것을 차단.
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  reporter: IS_CI ? [['html', { open: 'never' }], ['github']] : [['html', { open: 'never' }], ['list']],
  use: {
    baseURL: BASE_URL,
    // 실패 원인 추적용 아티팩트 (.gitignore 처리됨).
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium-web', use: { ...devices['Desktop Chrome'] } },
    // iOS WKWebView 회귀(Sentry CCHAKSA-56 류) 대비. Phase 1·2 핵심 시나리오부터 본격 활용.
    { name: 'webkit-web', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'yarn dev',
    url: BASE_URL,
    timeout: 120000,
    reuseExistingServer: !IS_CI,
  },
});
