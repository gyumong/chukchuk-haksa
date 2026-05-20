import { useEffect } from 'react';
import { useInternalRouter, type RoutePath } from '@/hooks/useInternalRouter';
import { useAuth } from '../contexts/AuthContext';

export function useAuthCheck(
  redirectTo: RoutePath = '/',
  requirePortalLinked: boolean = false,
  portalLinkRedirectTo: RoutePath = redirectTo
) {
  const router = useInternalRouter();
  const { accessToken, isPortalLinked, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) {return;}

    if (!accessToken) {
      router.push(redirectTo);
      return;
    }

    if (requirePortalLinked && isPortalLinked === false) {
      router.push(portalLinkRedirectTo);
    }
  }, [accessToken, isPortalLinked, isReady, redirectTo, requirePortalLinked, portalLinkRedirectTo, router]);

  return !isReady;
}
