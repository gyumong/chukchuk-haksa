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

  return (
    <>
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
    </>
  );
};

export default MpaHome;
