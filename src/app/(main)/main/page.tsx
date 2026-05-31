'use client';

import {
  DashboardAcademicSummaryCard,
  GraduationRequirementCard,
  DualMajorRequirementCard,
  ProfileCard,
  SyncUpdateButton,
} from '@/features/dashboard/components';
import { useRefreshProfileOnVisible } from '@/features/dashboard/hooks/useRefreshProfileOnVisible';
import { UserPropertiesSync } from '@/features/dashboard/components/UserPropertiesSync/UserPropertiesSync';
import AsyncBoundary from '@/shared/components/AsyncBoundary';

const Home = () => {
  useRefreshProfileOnVisible();

  return (
    <>
      <AsyncBoundary>
        <UserPropertiesSync />
      </AsyncBoundary>
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
    </>
  );
};

export default Home;
