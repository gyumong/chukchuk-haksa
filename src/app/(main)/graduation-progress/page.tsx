'use client';

import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import AsyncBoundary from '@/shared/components/AsyncBoundary';
import GraduationProgressHeader from '@/features/academic/components/progress/GraduationProgressHeader';
import AcademicSummarySection from '@/features/academic/components/progress/AcademicSummarySection';
import AreaProgressSection from '@/features/academic/components/progress/AreaProgressSection';
import styles from './page.module.scss';

function GraduationProgressContent() {
  return (
    <div className={styles.container}>
      <AsyncBoundary>
        <GraduationProgressHeader />
      </AsyncBoundary>
      <AsyncBoundary>
        <AcademicSummarySection />
      </AsyncBoundary>
      <AsyncBoundary>
        <AreaProgressSection />
      </AsyncBoundary>
    </div>
  );
}

export default function GraduationProgress() {
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <GraduationProgressContent />
    </ProtectedRoute>
  );
}
