'use client';

import { ROUTES } from '@/constants/routes';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { LectureEvaluationScreen } from '@/features/lecture-evaluation/components';
import AsyncBoundary from '@/shared/components/AsyncBoundary';

export default function MpaLectureEvaluationPage() {
  return (
    <ProtectedRoute requirePortalLinked={true} portalLinkRedirectTo={ROUTES.MPA.PORTAL_LOGIN}>
      <AsyncBoundary>
        <LectureEvaluationScreen exitRoute={ROUTES.MPA.HOME} />
      </AsyncBoundary>
    </ProtectedRoute>
  );
}
