import { useAuth } from '@/features/auth/contexts/AuthContext';
import type { ApiError } from '@/shared/api/errors';
import { getUserMessage } from '@/shared/user-messages';
import type { FallbackProps } from '../ErrorBoundary';
import { useEffect } from 'react';

const ApiErrorFallback = ({ error, reset }: FallbackProps) => {
  const apiError = error as ApiError;
  const { notifySessionExpired } = useAuth();

  // 401 = 인증 만료. 카드를 여기서 그리지 않고 전역에 알리기만 함 — 실제 화면은
  // ProtectedRoute 가 sessionExpired 를 보고 한 번만 그림 (위젯별 중복 노출 방지).
  useEffect(() => {
    if(apiError.status === 401){
      notifySessionExpired();
    }
  }, [apiError.status, notifySessionExpired]);

  if (apiError.status === 401) {
    return null;
  }

  return (
    <div>
      <h2>오류가 발생했습니다</h2>
      <p>{getUserMessage(apiError.status, apiError.code, apiError.message)}</p>

      {apiError.code && <p>에러 코드: {apiError.code}</p>}
      {apiError.status > 0 && <p>상태 코드: {apiError.status}</p>}

      <button onClick={reset}>다시 시도</button>
    </div>
  );
};

export default ApiErrorFallback;
