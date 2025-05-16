'use client';

import { useAuthCheck } from '../hooks/useAuthCheck';

const ProtectedRoute = ({ children, redirectTo = '/' }: { children: React.ReactNode; redirectTo?: string }) => {
  const isChecking = useAuthCheck(redirectTo);

  if (isChecking) {
    return <></>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
