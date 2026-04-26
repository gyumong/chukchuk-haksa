'use client';

import type { PropsWithChildren } from 'react';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import styles from './layout.module.scss';

export default function MpaLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
