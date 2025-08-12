import { type PropsWithChildren, Suspense, useCallback } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { ApiError } from '../api';
import { ApiErrorFallback, DefaultErrorFallback } from './error-fallback';
import ErrorBoundary, { type FallbackProps } from './ErrorBoundary';
import Spinner from './Spinner';

type AsyncProps = PropsWithChildren<{
  keys?: readonly unknown[];
  suspenseFallback?: React.ReactElement;
  customErrorFallback?: React.ComponentType<FallbackProps>;
}>;

const AsyncBoundary = ({ children, keys, suspenseFallback, customErrorFallback }: AsyncProps) => {
  const { reset } = useQueryErrorResetBoundary();

  const errorFallbackRenderer = useCallback(
    (props: FallbackProps) => {
      // 사용자가 커스텀 폴백을 제공한 경우 최우선 사용
      if (customErrorFallback) {
        const CustomFallback = customErrorFallback;
        return <CustomFallback {...props} />;
      }

      const { error } = props;
      console.log('error', error);

      // 에러 타입에 따라 적절한 폴백 컴포넌트 렌더링
      if (error instanceof ApiError) {
        return <ApiErrorFallback {...props} />;
      }

      // 기본 에러 폴백
      return <DefaultErrorFallback {...props} />;
    },
    [customErrorFallback]
  );
  return (
    <ErrorBoundary onReset={reset} fallbackRender={errorFallbackRenderer} keys={keys}>
      <Suspense fallback={suspenseFallback ?? <Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;
