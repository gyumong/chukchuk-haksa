import { useEffect, useState } from 'react';
import { useInternalRouter, type RoutePath } from '@/hooks/useInternalRouter';
import { getAccessToken } from '@/lib/auth/token';

export function useAuthCheck(redirectTo: RoutePath = '/', requirePortalLinked: boolean = false) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useInternalRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = getAccessToken();
      
      if (!token) {
        router.push(redirectTo);
        return;
      }

      // TODO: requirePortalLinked 체크 로직 추가 필요
      if (requirePortalLinked) {
        // 포털 연동 여부 확인 로직
      }

      setIsChecking(false);
    };

    checkAuth();
  }, [redirectTo, requirePortalLinked, router]);

  return isChecking;
}