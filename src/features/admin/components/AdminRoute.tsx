'use client';

import { useEffect, type PropsWithChildren } from 'react';
import { ROUTES } from '@/constants/routes';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useIsAdminUser } from '../hooks/useIsAdminUser';

function AdminGate({ children }: PropsWithChildren) {
  const isAdmin = useIsAdminUser();
  const router = useInternalRouter();

  useEffect(() => {
    if (isAdmin === false) {
      router.replace(ROUTES.SETTING);
    }
  }, [isAdmin, router]);

  if (isAdmin !== true) {
    return null;
  }

  return <>{children}</>;
}

export default function AdminRoute({ children }: PropsWithChildren) {
  return (
    <ProtectedRoute>
      <AdminGate>{children}</AdminGate>
    </ProtectedRoute>
  );
}