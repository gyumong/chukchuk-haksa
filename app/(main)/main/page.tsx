'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { DashboardData } from '@/types/api/dashboard';
import AcademicSummaryCard from '../components/AcademicSummaryCard/AcademicSummaryCard';
import GraduationRequirementCard from '../components/GraduationRequirementCard/GraduationRequirementCard';
import ProfileCard from '../components/ProfileCard/ProfileCard';
import styles from './page.module.scss';
import Image from 'next/image';

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await fetch('/api/get-dashboard');
      const data: DashboardData = await response.json();
      console.log('ㅇㅇ', data);
      setData(data);
      setIsLoading(false);
    };
    fetchDashboard();
  }, []);

  const handleGraduationProgress = () => {
    router.push(
      `/graduation-progress/${parseInt(data?.profile.studentCode.slice(0, 2) ?? '0')}/${data?.profile.departmentName}`
    );
  };

  return (
    <div>
      {isLoading ? (
        <div></div>
      ) : (
        <>
          <ProfileCard
            name={data?.profile.name ?? ''}
            department={data?.profile.departmentName ?? ''}
            studentId={data?.profile.studentCode ?? ''}
            grade={data?.profile.gradeLevel ?? 0}
            semester={data?.profile.currentSemester ?? 0}
            status={(data?.profile.status as '재학' | '휴학' | '졸업') ?? '재학'}
          />
          <div className={styles.gap16}></div>
          <AcademicSummaryCard
            earnedCredits={data?.summary.earnedCredits ?? 0}
            gpa={data?.summary.cumulativeGpa ?? 0}
            percentile={data?.summary.percentile ?? 0}
          />
          <div className={styles.gap18}></div>
          <GraduationRequirementCard
            majorType="주전공"
            admissionYear={parseInt(data?.profile.studentCode.slice(0, 2) ?? '0')}
            department={data?.profile.departmentName ?? ''}
            handleGraduationProgress={handleGraduationProgress}
            earnedCredits={data?.summary.earnedCredits ?? 0}
            requiredCredits={data?.summary.requiredCredits ?? 0}
          />
          <div className={styles.mainBannerContainer}>

          <Image 
          src="/images/illustrations/Tong.png" 
          alt="main-banner"
          width={380}    // 이미지의 실제 너비
          height={300}   
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          </div>
        </>
      )}
    </div>
  );
}
