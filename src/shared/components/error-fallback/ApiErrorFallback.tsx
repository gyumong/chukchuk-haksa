import type { ApiError } from '@/shared/api';
import type { FallbackProps } from '../ErrorBoundary';

const ApiErrorFallback = ({ error, reset }: FallbackProps) => {
  const apiError = error as ApiError;

  return (
    <div>
      <h2>오류가 발생했습니다</h2>
      <p>{apiError.message}</p>

      {apiError.code && <p>에러 코드: {apiError.code}</p>}
      {apiError.status > 0 && <p>상태 코드: {apiError.status}</p>}

      <button onClick={reset}>다시 시도</button>
    </div>
  );
};

export default ApiErrorFallback;
