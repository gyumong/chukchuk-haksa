'use client';

import { Suspense } from 'react';
import { useGraduationPageData } from '@/features/academic/apis/queries/useGraduationPageData';
import GraduationProgressHeader from '@/features/academic/components/progress/GraduationProgressHeader';
import AcademicSummarySection from '@/features/academic/components/progress/AcademicSummarySection';
import AreaProgressSection from '@/features/academic/components/progress/AreaProgressSection';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import styles from './page.module.scss';

function GraduationProgressContent() {
  const { data } = useGraduationPageData();

  return (
    <div className={styles.container}>
      <GraduationProgressHeader semesterGrades={data.semesterGrades} />
      <AcademicSummarySection academicSummary={data.academicSummary} />
      <AreaProgressSection areaProgress={data.graduationProgress} />
    </div>
  );
}

export default function GraduationProgressPage() {
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <Suspense fallback={<div></div>}>
        <GraduationProgressContent />
      </Suspense>
    </ProtectedRoute>
  );
}
