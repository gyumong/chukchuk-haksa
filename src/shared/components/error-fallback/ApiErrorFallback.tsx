'use client';

import { useEffect } from 'react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import type { ApiError } from '@/shared/api/errors';
import type { AsyncFallbackProps } from '@/shared/components/AsyncBoundary';
import { getErrorTreatment } from '@/shared/error-severity';
import { getUserMessage } from '@/shared/user-messages';
import { ErrorScreen } from './ErrorScreen';

const ApiErrorFallback = ({ error, reset, fullPage }: AsyncFallbackProps) => {
  const apiError = error as ApiError;
  const { notifySessionExpired } = useAuth();
  const router = useInternalRouter();

  const treatment = getErrorTreatment(apiError.appCode, 'query');
  const isGlobalAuthError = apiError.status === 401 || treatment?.severity === 'global';

  useEffect(() => {
    if (isGlobalAuthError) {
      notifySessionExpired();
    }
  }, [isGlobalAuthError, notifySessionExpired]);

  if (isGlobalAuthError) {
    return null;
  }

  const message = getUserMessage(apiError.status, apiError.appCode, apiError.message);

    return (
    <ErrorScreen
      message={message}
      code={apiError.appCode || undefined}
      fullPage={fullPage}
      onBack={() => router.back()}
      onRetry={reset}
      onInquiry={() => router.push(ROUTES.INQUIRY.NEW)}
    />
  );
};

export default ApiErrorFallback;