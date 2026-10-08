'use client';

import { ROUTES } from '@/constants/routes';
import {
  DashboardAcademicSummaryCard,
  DualMajorRequirementCard,
  GraduationRequirementCard,
  ProfileCard,
  SyncUpdateButton,
} from '@/features/dashboard/components';
import { useRefreshProfileOnVisible } from '@/features/dashboard/hooks/useRefreshProfileOnVisible';
import { LectureEvaluationEntryGate } from '@/features/lecture-evaluation/components';
import { PortalLinkDisabledHomeNotice } from '@/features/portal-link/components';
import AsyncBoundary from '@/shared/components/AsyncBoundary';

const Home = () => {
  useRefreshProfileOnVisible();

  return (
    <LectureEvaluationEntryGate evaluationRoute={ROUTES.LECTURE_EVALUATION}>
      <AsyncBoundary>
        <ProfileCard />
      </AsyncBoundary>
      <div className="gap-16"></div>
      <AsyncBoundary>
        <DashboardAcademicSummaryCard />
      </AsyncBoundary>
      <div className="gap-8"></div>
      <AsyncBoundary>
        <SyncUpdateButton />
      </AsyncBoundary>
      <div className="gap-18"></div>
      <AsyncBoundary>
        <GraduationRequirementCard />
      </AsyncBoundary>
      <div className="gap-8"></div>
      <AsyncBoundary>
        <DualMajorRequirementCard />
      </AsyncBoundary>
      <PortalLinkDisabledHomeNotice />
    </LectureEvaluationEntryGate>
  );
};

export default Home;
