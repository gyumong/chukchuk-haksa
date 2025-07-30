'use client';

import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import styles from './layout.module.scss';

export default function ResyncLoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
