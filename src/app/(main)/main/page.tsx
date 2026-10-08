'use client';

import { useState } from 'react';
import { PORTAL_LINK_DISABLED } from '@/constants/portal-link';
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
import { PortalLinkDisabledDialog } from '@/features/portal-link/components';
import AsyncBoundary from '@/shared/components/AsyncBoundary';

const Home = () => {
  useRefreshProfileOnVisible();
  // 포털 연동 일시 비활성화 공지 — 홈에 들어올 때마다 표시.
  const [isPortalNoticeOpen, setIsPortalNoticeOpen] = useState(PORTAL_LINK_DISABLED);

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
      <PortalLinkDisabledDialog isOpen={isPortalNoticeOpen} onClose={() => setIsPortalNoticeOpen(false)} />
    </LectureEvaluationEntryGate>
  );
};

export default Home;
