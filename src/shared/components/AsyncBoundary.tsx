import { type PropsWithChildren, Suspense } from 'react';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';
import Spinner from './Spinner';

type AsyncProps = PropsWithChildren<{
  keys?: readonly unknown[];
  suspenseFallback?: React.ReactElement;
}>;

const AsyncBoundary = ({ children, keys, suspenseFallback }: AsyncProps) => {
  const { reset } = useQueryErrorResetBoundary();
  return (
    <ErrorBoundary onReset={reset} fallbackRender={ErrorFallback} keys={keys}>
      <Suspense fallback={suspenseFallback ?? <Spinner />}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default AsyncBoundary;
