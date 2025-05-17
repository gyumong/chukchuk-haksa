'use client';

import {
  DashboardAcademicSummaryCard,
  GraduationRequirementCard,
  ProfileCard,
  SyncUpdateButton,
} from '@/features/dashboard/components';
import AsyncBoundary from '@/shared/components/AsyncBoundary';

const Home = () => {
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
        <SyncUpdateButton />
      </AsyncBoundary>
      <div className="gap-18"></div>
      <AsyncBoundary>
        <GraduationRequirementCard />
      </AsyncBoundary>
    </>
  );
};

export default Home;
