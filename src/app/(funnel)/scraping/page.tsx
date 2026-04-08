'use client';

import { useEffect } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';

/**
 * 이 페이지는 더 이상 사용되지 않습니다.
 * 포털 연동이 portal-login 페이지에서 비동기 job 폴링으로 처리됩니다.
 * 혹시 이 페이지에 직접 접근하는 경우를 위한 fallback 리다이렉트입니다.
 */
export default function ScrapingPage() {
  const router = useInternalRouter();

  useEffect(() => {
    router.replace('/complete');
  }, [router]);

  return <LoadingScreen />;
}
