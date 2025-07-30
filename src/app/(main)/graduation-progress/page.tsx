'use client';

import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import GraduationProgressContent from '@/features/academic/components/progress/GraduationProgressContent';

export default function GraduationProgress() {
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <GraduationProgressContent />
    </ProtectedRoute>
  );
}
