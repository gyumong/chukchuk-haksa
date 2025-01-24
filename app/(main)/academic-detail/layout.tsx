'use client';

import { useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './layout.module.scss';
import { Suspense } from 'react';

export default function GraduationProgressLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <TopNavigation.Preset title="학기별 세부 성적" type="back" onNavigationClick={() => router.back()} />
      <Suspense fallback={<div>로딩 중...</div>}>
        <div className={styles.content}>{children}</div>
      </Suspense>
    </div>
  );
}
