'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import type { DashboardData } from '@/types/api/dashboard';
import AcademicSummaryCard from '../components/AcademicSummaryCard/AcademicSummaryCard';
import GraduationRequirementCard from '../components/GraduationRequirementCard/GraduationRequirementCard';
import ProfileCard from '../components/ProfileCard/ProfileCard';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
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
      `${ROUTES.GRADUATION_PROGRESS}/${parseInt(data?.profile.studentCode.slice(0, 2) ?? '0')}/${data?.profile?.majorName ? data?.profile?.majorName : (data?.profile?.departmentName ?? '')}`
    );
  };

  const handleResyncLogin = () => {
    router.push(ROUTES.FUNNEL.RESYNC_LOGIN);
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
      <button onClick={handleResyncLogin}>학업 이력 동기화하기</button>
    </div>
  );
}
