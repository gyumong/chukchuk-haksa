import { useEffect } from 'react';
import { useInternalRouter, type RoutePath } from '@/hooks/useInternalRouter';
import { useAuth } from '../contexts/AuthContext';

// 마운트 이후에도 accessToken 이 null 로 전이하면 (만료 → refresh 실패 등) 즉시 redirect.
// router.replace 사용 — 만료된 보호 페이지가 히스토리에 남아 뒤로가기로 돌아가는 사고 방지.
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
      router.replace(redirectTo);
      return;
    }

    if (requirePortalLinked && isPortalLinked === false) {
      router.replace(portalLinkRedirectTo);
    }
  }, [accessToken, isPortalLinked, isReady, redirectTo, requirePortalLinked, portalLinkRedirectTo, router]);

  return !isReady;
}
