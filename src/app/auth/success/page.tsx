'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ACCESS_TOKEN_KEY } from '@/constants';
import { setPortalLinked } from '@/lib/auth/token';
import { type RoutePath, useInternalRouter } from '@/hooks/useInternalRouter';

const SuccessPage = () => {
  const router = useInternalRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const isPortalLinkedParam = searchParams.get('isPortalLinked');
    const redirect = (searchParams.get('redirect') as RoutePath) || '/main';

    if (token && isPortalLinkedParam !== null) {
      // 토큰 세션 스토리지에 저장
      sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
      
      // 포털 연동 상태 저장
      const isPortalLinked = isPortalLinkedParam === 'true';
      setPortalLinked(isPortalLinked);

      // 원래 목적지로 리디렉션
      router.replace(redirect);
    } else {
      // 토큰이나 포털 연동 정보가 없으면 로그인 페이지로
      router.replace('/');
    }
  }, [router, searchParams]);

  return <div className="flex items-center justify-center h-screen"></div>;
};

export default SuccessPage;
