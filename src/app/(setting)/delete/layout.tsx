'use client';

import type { PropsWithChildren } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  const router = useInternalRouter();
  return (
    // 미연동 유저도 탈퇴 가능해야 하므로 portal-link 게이트를 걸지 않는다(/setting 과 동일 정책).
    <ProtectedRoute>
      <div className={styles.container}>
        <TopNavigation.Preset title="탈퇴하기" type="back" onNavigationClick={() => router.back()} />
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
