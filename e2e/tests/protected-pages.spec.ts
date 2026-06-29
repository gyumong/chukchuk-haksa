// Phase 2 — 보호 페이지 새로고침 회귀 방어 (PR #201).
// 연동 계정으로 보호 페이지를 반복 새로고침해도 인증 race로 인한 A05("인증이 필요한 요청입니다.")
// 에러 폴백이 노출되지 않아야 한다. 각 카드가 개별 AsyncBoundary라, 한 카드만 새는 경우도 잡도록 toHaveCount(0).
import type { Page } from '@playwright/test';
import { expect, test } from '../fixtures/auth';
import { seedLinkedAcademics, verifyLinkedReady } from '../fixtures/seed';

// 새로고침 반복 횟수. dev 서버 + 실제 백엔드라 느려서, race를 재현할 만큼만(3회) 돌린다.
const RELOADS = 3;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// A05 / 인증 에러 폴백(ApiErrorFallback 401 분기 포함)이 화면 어디에도 없어야 한다.
async function expectNoAuthError(page: Page) {
  await expect(page.getByText('세션이 만료되었습니다')).toHaveCount(0);
  await expect(page.getByText('로그인하러 가기')).toHaveCount(0);
  await expect(page.getByText('인증이 필요한 요청입니다.')).toHaveCount(0);
  await expect(page.getByText('오류가 발생했습니다')).toHaveCount(0);
  await expect(page.getByText(/에러 코드:\s*A05/)).toHaveCount(0);
}

test.describe('보호 페이지 새로고침 회귀 (PR #201)', () => {
  test('연동 계정으로 보호 페이지를 반복 새로고침해도 A05 인증 에러가 노출되지 않는다', async ({ page, loginAs }) => {
    // dev 모드 + 실제 백엔드 + 3개 페이지 × 반복 새로고침이라 기본 30초로는 부족.
    test.setTimeout(120_000);

    const user = await loginAs('linked');
    await verifyLinkedReady(user);
    const { latestYear, latestSemester } = await seedLinkedAcademics(user);

    // 합성 시드 계정은 실제 포털 스크래핑을 거치지 않아 reconnectionRequired=true → useProfileQuery 가
    // /resync/login 으로 router.push 한다(useProfileQuery.ts:22-25). Phase 2 의 관심사는 인증 race(A05)이지
    // 재연동이 아니므로, 프로필 성공 응답의 이 플래그만 false 로 고정해 건강한 연동 사용자 시나리오를 만든다.
    // (401/A05 응답은 그대로 통과 → 회귀 가드는 유지.)
    await page.route(/\/api\/student\/profile(?:\?|$)/, async route => {
      const response = await route.fetch();
      const body = (await response.json()) as {
        data?: { reconnectionRequired?: boolean };
        reconnectionRequired?: boolean;
      };
      const profile = body.data ?? body;
      profile.reconnectionRequired = false;
      await route.fulfill({ response, json: body });
    });

    // mustSee: 각 레이아웃 헤더(또는 동등 텍스트). ProtectedRoute를 통과해 hydration된 뒤에야 보이므로,
    // 이걸 기다리면 (a) 보호 페이지 정상 렌더 + (b) A05 체크 시점이 hydration 이후임이 보장된다.
    // graduation 타이틀은 createGraduationTitle 결과라 동적이지만 "졸업요건"을 포함(+Suspense fallback도 "졸업요건").
    const targets: Array<{ path: string; mustSee: string | RegExp }> = [
      { path: '/main', mustSee: '수원대학교' },
      { path: `/academic-detail?year=${latestYear}&semester=${latestSemester}`, mustSee: '학기별 세부 성적' },
      { path: '/graduation-progress', mustSee: /졸업요건/ },
    ];

    for (const { path, mustSee } of targets) {
      const basePath = path.split('?')[0];
      const onTarget = new RegExp(escapeRegExp(basePath) + '(?:[/?#]|$)');

      // dev 모드에서 'load'(모든 서브리소스)까지 기다리면 느려 타임아웃 → domcontentloaded 로 충분.
      await page.goto(path, { waitUntil: 'domcontentloaded' });

      for (let i = 0; i < RELOADS; i++) {
        await page.reload({ waitUntil: 'domcontentloaded' });

        // 1) 보호 페이지에서 쫓겨나지 않았는지 (연동 + reconnectionRequired=false 확인).
        await expect(page, `${path} 에서 벗어나면 안 됨 (reload #${i + 1})`).toHaveURL(onTarget);

        // 2) hydration 완료(정상 렌더) 대기 — A05 체크가 의미 있도록.
        await expect(page.getByText(mustSee), `${path} 콘텐츠가 보여야 함 (reload #${i + 1})`).toBeVisible();

        // 3) 핵심: 인증 에러 폴백 부재 (회귀 가드).
        await expectNoAuthError(page);
      }
    }

    // 종료 시 in-flight 라우트 콜백이 'Test ended' 에러를 내지 않도록 정리.
    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
