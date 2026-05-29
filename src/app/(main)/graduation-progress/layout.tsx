import GraduationNavigationHeader from '@/features/academic/components/progress/GraduationNavigationHeader';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import styles from './layout.module.scss';

export const dynamic = 'force-dynamic';
export default function GraduationProgressLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <div className={styles.container}>
        <GraduationNavigationHeader />
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
