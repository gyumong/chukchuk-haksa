'use client';

import type { PropsWithChildren } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  const router = useInternalRouter();
  return (
    // 미연동(학교 연동 안 함/탈퇴 후 재로그인) 유저도 탈퇴할 수 있어야 하므로 portal-link 게이트를 걸지 않는다.
    // 설정 하위는 현재 '탈퇴하기' 단일 메뉴라 미연동 노출에 부작용이 없다(메뉴 추가 시 접근 정책 재검토).
    <ProtectedRoute>
      <div className={styles.container}>
        <TopNavigation.Preset title="설정" type="back" onNavigationClick={() => router.back()} />
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
