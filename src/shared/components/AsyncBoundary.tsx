'use client';

import { type PropsWithChildren, Suspense, useCallback, useLayoutEffect, useState } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ApiError } from '../api';
import { claimError } from './errorDedupe';
import { ApiErrorFallback, DefaultErrorFallback } from './error-fallback';
import ErrorBoundary, { type FallbackProps } from './ErrorBoundary';
import Spinner from './Spinner';

export type AsyncFallbackProps = FallbackProps & { fullPage?: boolean };

type AsyncProps = PropsWithChildren<{
  keys?: readonly unknown[];
  suspenseFallback?: React.ReactElement;
  customErrorFallback?: React.ComponentType<AsyncFallbackProps>;
  /**
   * true면 이 영역의 에러를 카드 단위가 아니라 화면 전체를 덮는 형태로 보여준다.
   * 페이지의 유일한 콘텐츠인 화면(강의평가, 학사상세 등)에서만 사용하고,
   * 여러 카드가 나란히 있는 대시보드 계열에서는 쓰지 않는다.
   */
  fullPage?: boolean;
}>;

// 같은 에러 객체(= 같은 쿼리의 같은 실패)를 구독하는 AsyncBoundary가 화면에 여러 개
// 있을 때, 가장 먼저 그려진 곳만 에러 UI를 보여주고 나머지는 숨긴다.
function DedupedFallback({
  error,
  reset,
  fullPage,
  Fallback,
}: AsyncFallbackProps & { Fallback: React.ComponentType<AsyncFallbackProps> }) {
  const [isOwner, setIsOwner] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    setIsOwner(claimError(error));
  }, [error]);

  if (isOwner === false) {
    return null;
  }
  return <Fallback error={error} reset={reset} fullPage={fullPage} />;
}

const AsyncBoundary = ({ children, keys, suspenseFallback, customErrorFallback, fullPage }: AsyncProps) => {
  const { reset } = useQueryErrorResetBoundary();

  const errorFallbackRenderer = useCallback(
    (props: FallbackProps) => {
      const Fallback =
        customErrorFallback ?? (props.error instanceof ApiError ? ApiErrorFallback : DefaultErrorFallback);

      return <DedupedFallback {...props} fullPage={fullPage} Fallback={Fallback} />;
    },
    [customErrorFallback, fullPage]
  );

  return (
    <ErrorBoundary onReset={reset} fallbackRender={errorFallbackRenderer} keys={keys}>
      <Suspense fallback={suspenseFallback ?? <Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;