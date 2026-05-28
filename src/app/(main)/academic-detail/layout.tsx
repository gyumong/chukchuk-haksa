'use client';

import { TopNavigation } from '@/components/ui/TopNavigation';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './layout.module.scss';

export default function GraduationProgressLayout({ children }: { children: React.ReactNode }) {
  const router = useInternalRouter();

  return (
    <ProtectedRoute requirePortalLinked={true}>
      <div className={styles.container}>
        <TopNavigation.Preset title="학기별 세부 성적" type="back" onNavigationClick={() => router.back()} />
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
