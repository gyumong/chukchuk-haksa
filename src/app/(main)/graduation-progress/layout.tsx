'use client';

import { Suspense } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import styles from './layout.module.scss';

function GraduationProgressHeader() {
  const router = useInternalRouter();
  const { data: profile } = useProfileQuery();
  
  const admissionYear = profile.studentCode.slice(0, 2);
  const departmentName = profile.departmentName ?? profile.majorName;
  const title = `${admissionYear}학번 ${departmentName} 졸업요건`;

  return (
    <TopNavigation.Preset 
      title={title} 
      type="back" 
      onNavigationClick={() => router.back()} 
    />
  );
}

export default function GraduationProgressLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <Suspense fallback={<TopNavigation.Preset title="졸업요건" type="back" onNavigationClick={() => {}} />}>
        <GraduationProgressHeader />
      </Suspense>
      <div className={styles.content}>{children}</div>
    </div>
  );
}