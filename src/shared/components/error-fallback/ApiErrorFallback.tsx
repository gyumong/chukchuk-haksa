import { useAuth } from '@/features/auth/contexts/AuthContext';
import type { ApiError } from '@/shared/api/errors';
import { getUserMessage } from '@/shared/user-messages';
import type { FallbackProps } from '../ErrorBoundary';

const ApiErrorFallback = ({ error, reset }: FallbackProps) => {
  const apiError = error as ApiError;
  const { clearAuth } = useAuth();

  // 401 = 인증 만료. 일반 재시도가 의미 없으므로 세션 정리 + 로그인 페이지 안내.
  // (refresh 가 가능했다면 customFetch / GET /api/session 단계에서 이미 처리됐을 것)
  if (apiError.status === 401) {
    return (
      <div>
        <h2>세션이 만료되었습니다</h2>
        <p>보안을 위해 자동 로그아웃되었어요.{'\n'}다시 로그인해주세요.</p>
        <button onClick={() => clearAuth()}>로그인하러 가기</button>
      </div>
    );
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
