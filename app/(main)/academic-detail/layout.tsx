'use client';

import { useInternalRouter } from '@/hooks/useInternalRouter';
import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './layout.module.scss';

export default function GraduationProgressLayout({ children }: { children: React.ReactNode }) {
  const router = useInternalRouter();

  return (
    <div className={styles.container}>
      <TopNavigation.Preset title="학기별 세부 성적" type="back" onNavigationClick={() => router.back()} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
