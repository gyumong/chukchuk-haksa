'use client';

import { ROUTES } from '@/constants/routes';
import GraduationProgressContent from '@/features/academic/components/progress/GraduationProgressContent';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

export default function MpaGraduationProgress() {
  return (
    <ProtectedRoute requirePortalLinked={true} redirectTo={ROUTES.MPA.HOME}>
      <GraduationProgressContent />
    </ProtectedRoute>
  );
}
