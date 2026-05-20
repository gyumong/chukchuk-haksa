'use client';

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

  if (isChecking) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
