'use client';

import type { RoutePath } from '@/hooks/useInternalRouter';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useEffect, useState } from 'react';
import { ROUTES } from '@/constants/routes';
import type { DashboardData } from '@/types/api/dashboard';
import AcademicSummaryCard from '../components/AcademicSummaryCard/AcademicSummaryCard';
import GraduationRequirementCard from '../components/GraduationRequirementCard/GraduationRequirementCard';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import SyncUpdateButton from '../components/SyncUpdateButton/SyncUpdateButton';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useInternalRouter();
  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await fetch('/api/get-dashboard');
      const data: DashboardData = await response.json();
      setData(data);
      setIsLoading(false);
    };
    fetchDashboard();
  }, []);

  const handleGraduationProgress = () => {
    router.push(
      `${ROUTES.GRADUATION_PROGRESS}/${parseInt(data?.profile.studentCode.slice(0, 2) ?? '0')}/${data?.profile?.majorName ? data?.profile?.majorName : (data?.profile?.departmentName ?? '')}` as RoutePath
    );
  };

  const handleResyncLogin = () => {
    router.push(ROUTES.RESYNC.LOGIN);
  };

  return (
    <div>
      {isLoading ? (
        <div></div>
      ) : (
        <>
          <ProfileCard
            name={data?.profile.name ?? ''}
            majorName={data?.profile.majorName ?? ''}
            studentId={data?.profile.studentCode ?? ''}
            grade={data?.profile.gradeLevel ?? 0}
            semester={data?.profile.currentSemester ?? 0}
            status={(data?.profile.status as '재학' | '휴학' | '졸업') ?? '재학'}
          />
          <div className="gap-16"></div>
          <AcademicSummaryCard
            earnedCredits={data?.summary.earnedCredits ?? 0}
            gpa={data?.summary.cumulativeGpa ?? 0}
            percentile={data?.summary.percentile ?? 0}
          />
          <div className="gap-8"></div>
          <SyncUpdateButton lastSyncedAt={data?.user?.lastSyncedAt ?? ''} onClick={handleResyncLogin} />
          <div className="gap-18"></div>
          <GraduationRequirementCard
            majorType="주전공"
            admissionYear={parseInt(data?.profile.studentCode.slice(0, 2) ?? '0')}
            majorName={data?.profile?.majorName ? data?.profile?.majorName : (data?.profile?.departmentName ?? '')}
            handleGraduationProgress={handleGraduationProgress}
            earnedCredits={data?.summary.earnedCredits ?? 0}
            requiredCredits={data?.summary.requiredCredits ?? 0}
          />
        </>
      )}
    </div>
  );
}
