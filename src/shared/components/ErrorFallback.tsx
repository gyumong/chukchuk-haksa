import type { FallbackProps } from './ErrorBoundary';

const ErrorFallback = ({ error, reset }: FallbackProps) => {
  return (
    <div>
      <h1>Error</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default ErrorFallback;
