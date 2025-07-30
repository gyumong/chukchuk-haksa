'use client';

import { useAuthCheck } from '../hooks/useAuthCheck';

import type { RoutePath } from '@/hooks/useInternalRouter';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: RoutePath;
  requirePortalLinked?: boolean;
}

const ProtectedRoute = ({ children, redirectTo = '/', requirePortalLinked = false }: ProtectedRouteProps) => {
  const isChecking = useAuthCheck(redirectTo, requirePortalLinked);

  if (isChecking) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
