'use client';

import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import type { AsyncFallbackProps } from '@/shared/components/AsyncBoundary';
import { ErrorScreen } from './ErrorScreen';

/**
 * ApiError가 아닌 예상치 못한 에러(JS 런타임 에러 등)를 위한 기본 Fallback.
 */
const DefaultErrorFallback = ({ reset, fullPage }: AsyncFallbackProps) => {
  const router = useInternalRouter();

  return (
    <ErrorScreen
      message={'알 수 없는 오류가 발생했어요.\n잠시 후 다시 시도해주세요.'}
      fullPage={fullPage}
      onRetry={reset}
      onInquiry={() => router.push(ROUTES.INQUIRY.HOME)}
    />
  );
};

export default DefaultErrorFallback;