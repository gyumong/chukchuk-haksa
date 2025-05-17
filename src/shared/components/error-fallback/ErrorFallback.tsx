import type { FallbackProps } from '../ErrorBoundary';

/**
 * 일반 에러 처리를 위한 기본 Fallback 컴포넌트
 */
const DefaultErrorFallback = ({ error, reset }: FallbackProps) => {
  // 에러 메시지 추출
  const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

  return (
    <div className="error-container">
      <h2>오류가 발생했습니다</h2>
      <p className="error-message">{errorMessage}</p>
      <button onClick={reset} className="retry-button">
        다시 시도
      </button>
    </div>
  );
};

export default DefaultErrorFallback;
