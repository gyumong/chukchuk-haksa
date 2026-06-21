'use client';

import {
  DashboardAcademicSummaryCard,
  GraduationRequirementCard,
  DualMajorRequirementCard,
  ProfileCard,
  SyncUpdateButton,
} from '@/features/dashboard/components';
import { ROUTES } from '@/constants/routes';
import { LectureEvaluationEntryGate } from '@/features/lecture-evaluation/components';
import { useRefreshProfileOnVisible } from '@/features/dashboard/hooks/useRefreshProfileOnVisible';
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
    </LectureEvaluationEntryGate>
  );
};

export default Home;
