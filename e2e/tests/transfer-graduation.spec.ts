// 편입생 졸업요건 화면 — analysisType === 'TRANSFER' 응답을 받았을 때의 표시 형식 회귀 방어.
//
// 실제 편입생 계정을 Admin Test API 로 만들 수 없으므로(편입 인정학점·지정과목 시딩 미지원),
// 연동 계정으로 로그인한 뒤 GET /api/graduation/progress 응답만 편입생 fixture 로 바꿔 렌더를 검증한다.
// 그 외 API(학기·학업 요약·프로필)는 실제 dev 백엔드를 그대로 탄다.
//
// 검증 항목(종건님 전달 스펙):
//  1) 맨 위 '지정과목 | 이수한 학점' 카드 + 드롭다운으로 지정과목별 이수 여부
//  2) 전핵·전선은 "이수 / 기준"(기준은 50% 라 소수점 가능) 그대로
//  3) 그 외 영역은 숫자만(학점 접미사 없이)
//  4) (i) 클릭 시 편입생 표시 형식 안내 팝업
import { expect, test } from '../fixtures/auth';
import { seedLinkedAcademics, verifyLinkedReady } from '../fixtures/seed';

const GRADUATION_PROGRESS_ROUTE = /\/api\/graduation\/progress(?:\?|$)/;

// GraduationProgressApiResponse 형태(Spring 래퍼). 영역 순서는 일부러 섞어 FE 정렬(전핵·전선 → 그 외)을 확인한다.
const transferProgressFixture = {
  success: true,
  data: {
    analysisType: 'TRANSFER',
    analysisStatus: 'MANUAL_REVIEW_REQUIRED',
    graduationProgress: [],
    languageCertFulfilled: null,
    languageCertNeedsRefresh: false,
    hasDifferentGraduationRequirement: false,
    transferProgress: {
      requiredTotalCredits: 130,
      totalEarnedCredits: 112,
      remainingCredits: 18,
      creditsFulfilled: false,
      recognizedTransferCredits: 65,
      cumulativeGpa: 3.2,
      requiredGpa: 2,
      gpaFulfilled: true,
      completedSemesters: 3,
      designatedCoursesNeedsRefresh: false,
      designatedCourses: [
        { courseCode: 'C101', courseName: 'E2E 지정 자료구조', credits: 3, status: 'COMPLETED' },
        { courseCode: 'C102', courseName: 'E2E 지정 알고리즘', credits: 3, status: 'NOT_COMPLETED' },
        { courseCode: 'C103', courseName: 'E2E 지정 운영체제', credits: 3, status: 'UNKNOWN' },
      ],
      designatedEarnedCredits: 3,
      designatedCreditUnavailableReasons: [],
      manualReviewRequired: true,
      manualReviewReasons: ['REQUIRED_COURSES_NOT_ASSESSABLE'],
      areas: [
        {
          areaType: '중핵',
          evaluationType: 'EARNED_ONLY',
          earnedCredits: 9,
          countedCredits: null,
          requiredCredits: null,
          fulfilled: null,
          courses: [{ courseName: 'E2E 중핵교양 A', credits: 3, grade: 'A+', year: 2021, semester: 10 }],
          requiredCourses: [],
          unavailableReasons: [],
        },
        {
          areaType: '전선',
          evaluationType: 'COMPARISON',
          earnedCredits: 9,
          countedCredits: 9,
          requiredCredits: 16.5,
          fulfilled: false,
          courses: [{ courseName: 'E2E 전공선택 A', credits: 3, grade: 'A0', year: 2021, semester: 20 }],
          requiredCourses: [],
          unavailableReasons: [],
        },
        {
          areaType: '전핵',
          evaluationType: 'COMPARISON',
          earnedCredits: 12,
          countedCredits: 12,
          requiredCredits: 10.5,
          fulfilled: true,
          courses: [
            { courseName: 'E2E 전공핵심 A', credits: 3, grade: 'A+', year: 2021, semester: 10 },
            { courseName: 'E2E 전공핵심 B', credits: 3, grade: 'A+', year: 2022, semester: 10 },
          ],
          requiredCourses: [],
          unavailableReasons: [],
        },
        {
          areaType: '선교',
          evaluationType: 'EARNED_ONLY',
          earnedCredits: 4,
          countedCredits: null,
          requiredCredits: null,
          fulfilled: null,
          courses: [
            { courseName: 'E2E 선택교양 A', credits: 2, grade: 'B+', year: 2021, semester: 20, liberalAreaCode: 1 },
          ],
          requiredCourses: [],
          unavailableReasons: [],
        },
      ],
    },
  },
};

test.describe('편입생 졸업요건 표시', () => {
  test('지정과목 카드 · 전핵/전선 비교 표시 · 그 외 취득학점만 · 안내 팝업', async ({ page, loginAs }) => {
    // dev 모드 + 실제 백엔드(시딩 포함)라 기본 30초로는 부족.
    test.setTimeout(120_000);

    const user = await loginAs('linked');
    await verifyLinkedReady(user);
    await seedLinkedAcademics(user);

    // 합성 시드 계정은 reconnectionRequired=true → /resync/login 으로 튕긴다. protected-pages.spec 과 동일하게 고정.
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

    await page.route(GRADUATION_PROGRESS_ROUTE, route => route.fulfill({ json: transferProgressFixture }));

    await page.goto('/graduation-progress', { waitUntil: 'domcontentloaded' });

    // 1) 지정과목 카드가 영역 카드들보다 위에, 이수한 지정과목 학점과 함께 ("지정과목" + "3" 만 담은 헤더).
    const designatedHeader = page
      .locator('div')
      .filter({ hasText: /^지정과목3$/ })
      .first();
    await expect(designatedHeader).toBeVisible();

    const cardTitles = page.locator('span', { hasText: /^(지정과목|전공핵심|전공선택|중핵교양|선택교양)$/ });
    await expect(cardTitles).toHaveText(['지정과목', '전공핵심', '전공선택', '중핵교양', '선택교양']);

    // 2) 전핵·전선은 "이수 / 기준" 그대로 (기준 소수점 유지, 충족한 전핵이 미충족 전선보다 앞).
    await expect(page.getByText('12 / 10.5')).toBeVisible();
    await expect(page.getByText('9 / 16.5')).toBeVisible();

    // 3) 그 외 영역은 숫자만 — "학점" 접미사도 기준 표기도 없어야 한다.
    const bareCreditHeader = (title: string, credits: number) =>
      page
        .locator('div')
        .filter({ hasText: new RegExp(`^${title}${credits}$`) })
        .first();
    await expect(bareCreditHeader('중핵교양', 9)).toBeVisible();
    await expect(bareCreditHeader('선택교양', 4)).toBeVisible();
    await expect(page.getByText(/^9 \/ /)).toHaveCount(1); // 전선 한 곳만

    // 4) 드롭다운 → 지정과목별 이수 여부.
    await page.getByText('지정과목', { exact: true }).click();
    // 과목명과 상태 배지를 모두 담은 가장 안쪽 div = 지정과목 행.
    const statusOf = (name: string) =>
      page
        .locator('div')
        .filter({ has: page.getByText(name, { exact: true }) })
        .filter({ has: page.locator('[data-status]') })
        .last()
        .locator('[data-status]');
    await expect(statusOf('E2E 지정 자료구조')).toHaveText('이수');
    await expect(statusOf('E2E 지정 알고리즘')).toHaveText('미이수');
    await expect(statusOf('E2E 지정 운영체제')).toHaveText('확인 필요');

    // 5) (i) → 편입생 안내 팝업. 카드 토글(stopPropagation)과 분리돼 있어야 한다.
    await page.getByRole('button', { name: '편입생 졸업요건 안내 보기' }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('편입생 졸업요건 안내');
    await expect(dialog).toContainText('공통적으로 통용되는 기준을 적용하였습니다');
    await expect(dialog).toContainText('학과 사무실에서 확인해주시기 바랍니다');
    await dialog.getByRole('button', { name: '확인' }).click();
    await expect(dialog).toHaveCount(0);

    // (외국어인증제도 행은 실제 dev 백엔드 language-cert/requirement 응답에 의존해 합성 계정에선 느리거나
    //  미응답일 수 있어 여기서 단언하지 않는다 — 편입생 분기와 무관한 기존 섹션.)

    await page.unrouteAll({ behavior: 'ignoreErrors' });
  });
});
