import type { PropsWithChildren } from 'react';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { FunnelProvider } from './contexts/FunnelContext';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <FunnelProvider>
        <div className={styles.container}>
          <div className={styles.content}>{children}</div>
        </div>
      </FunnelProvider>
    </ProtectedRoute>
  );
}
