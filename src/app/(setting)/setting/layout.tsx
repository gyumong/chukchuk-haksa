'use client';

import type { PropsWithChildren } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  const router = useInternalRouter();
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <div className={styles.container}>
        <TopNavigation.Preset title="설정" type="back" onNavigationClick={() => router.back()} />
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
