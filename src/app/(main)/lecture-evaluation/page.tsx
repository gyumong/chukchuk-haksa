'use client';

import { ROUTES } from '@/constants/routes';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { LectureEvaluationScreen } from '@/features/lecture-evaluation/components';
import AsyncBoundary from '@/shared/components/AsyncBoundary';

export default function LectureEvaluationPage() {
  return (
    <ProtectedRoute requirePortalLinked={true} portalLinkRedirectTo={ROUTES.FUNNEL.PORTAL_LOGIN}>
      <AsyncBoundary>
        <LectureEvaluationScreen exitRoute={ROUTES.MAIN} />
      </AsyncBoundary>
    </ProtectedRoute>
  );
}
