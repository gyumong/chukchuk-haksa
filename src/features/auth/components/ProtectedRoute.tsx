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
  const { accessToken, isPortalLinked } = useAuth();

  // 토큰이 마운트 이후 만료/refresh 실패로 null 이 된 케이스에서도 children 을 즉시 unmount.
  // useAuthCheck 의 redirect 가 트리거되는 동안 자식 컴포넌트가 만료된 토큰으로 API 호출해
  // 401/NETWORK_ERROR fallback 이 깜빡이는 것을 막는다. requirePortalLinked 도 동일 원리.
  if (isChecking || !accessToken || (requirePortalLinked && isPortalLinked === false)) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
