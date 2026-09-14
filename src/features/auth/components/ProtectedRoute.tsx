'use client';

import { useAuth } from '../contexts/AuthContext';
import { useAuthCheck } from '../hooks/useAuthCheck';

import type { RoutePath } from '@/hooks/useInternalRouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: RoutePath;
  requirePortalLinked?: boolean;
  portalLinkRedirectTo?: RoutePath;
}

const ProtectedRoute = ({
  children,
  redirectTo = '/',
  requirePortalLinked = false,
  portalLinkRedirectTo,
}: ProtectedRouteProps) => {
  const isChecking = useAuthCheck(redirectTo, requirePortalLinked, portalLinkRedirectTo);
  const { accessToken, isPortalLinked, sessionExpired, clearAuth } = useAuth();

  if (sessionExpired) {
    return(
      <div>
        <h2>세션이 만료되었습니다</h2>
        <p>보안을 위해 자동 로그아웃되었어요.{'\n'}다시 로그인해주세요.</p>
        <button onClick={()=> clearAuth()}>로그인하러 가기</button>
      </div>
    )
  }
  // 토큰이 마운트 이후 만료/refresh 실패로 null 이 된 케이스에서도 children 을 즉시 unmount.
  // useAuthCheck 의 redirect 가 트리거되는 동안 자식 컴포넌트가 만료된 토큰으로 API 호출해
  // 401/NETWORK_ERROR fallback 이 깜빡이는 것을 막는다. requirePortalLinked 도 동일 원리.
  if (isChecking || !accessToken || (requirePortalLinked && isPortalLinked === false)) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
