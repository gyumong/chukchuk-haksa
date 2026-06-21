'use client';

import { ROUTES } from '@/constants/routes';
import {
  DashboardAcademicSummaryCard,
  GraduationRequirementCard,
  DualMajorRequirementCard,
  ProfileCard,
  SyncUpdateButton,
} from '@/features/dashboard/components';
import { useRefreshProfileOnVisible } from '@/features/dashboard/hooks/useRefreshProfileOnVisible';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { LectureEvaluationEntryGate } from '@/features/lecture-evaluation/components';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { navigateNative } from '@/lib/webview';
import AsyncBoundary from '@/shared/components/AsyncBoundary';

const MpaHome = () => {
  useRefreshProfileOnVisible();
  const router = useInternalRouter();

  const goGraduation = () => {
    if (!navigateNative(ROUTES.MPA.GRADUATION_PROGRESS)) {
      router.push(ROUTES.MPA.GRADUATION_PROGRESS);
    }
  };
  const goResync = () => {
    if (!navigateNative(ROUTES.MPA.RESYNC_LOGIN)) {
      router.push(ROUTES.MPA.RESYNC_LOGIN);
    }
  };

  // 미연동(신규·탈퇴 후 재로그인 등) 사용자가 네이티브에 의해 /mpa/home 으로 진입하면 대시보드 카드들이
  // 미연동 상태로 백엔드를 호출해 "아직 포털과 연동되지 않은 사용자입니다"(401) 가 카드 수만큼 쏟아진다.
  // web 의 /main 레이아웃과 동일하게 portal-link 게이트를 걸어, 미연동이면 카드를 렌더하지 않고
  // /mpa/portal-login 으로 보낸다. (게이트가 false 를 보려면 GET /api/session 이 미연동 세션을 destroy
  // 하지 않고 isPortalLinked:false 로 응답해야 한다 — 동반 수정: src/app/api/session/route.ts)
  return (
    <ProtectedRoute requirePortalLinked={true} portalLinkRedirectTo={ROUTES.MPA.PORTAL_LOGIN}>
      <LectureEvaluationEntryGate evaluationRoute={ROUTES.MPA.LECTURE_EVALUATION}>
        <AsyncBoundary>
          <ProfileCard />
        </AsyncBoundary>
        <div className="gap-16"></div>
        <AsyncBoundary>
          <DashboardAcademicSummaryCard />
        </AsyncBoundary>
        <div className="gap-8"></div>
        <AsyncBoundary>
          <SyncUpdateButton onNavigate={goResync} />
        </AsyncBoundary>
        <div className="gap-18"></div>
        <AsyncBoundary>
          <GraduationRequirementCard onNavigate={goGraduation} />
        </AsyncBoundary>
        <div className="gap-8"></div>
        <AsyncBoundary>
          <DualMajorRequirementCard onNavigate={goGraduation} />
        </AsyncBoundary>
      </LectureEvaluationEntryGate>
    </ProtectedRoute>
  );
};

export default MpaHome;
