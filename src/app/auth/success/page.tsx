'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { type RoutePath, useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './success.module.scss';

const SuccessContent = () => {
  const router = useInternalRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const redirect = (searchParams.get('redirect') as RoutePath) || '/main';

    const hydrate = async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' });
        if (!response.ok) {
          setErrorMessage('세션을 확인할 수 없어요\n다시 로그인해주세요');
          setTimeout(() => router.replace('/'), 1500);
          return;
        }
        router.replace(redirect);
      } catch (error) {
        console.error('[auth/success] session hydrate failed', error);
        setErrorMessage('로그인 처리 중 오류가 발생했어요\n잠시 후 다시 시도해주세요');
        setTimeout(() => router.replace('/'), 1500);
      }
    };

    hydrate();
  }, [router, searchParams]);

  return (
    <div className={styles.container}>
      {errorMessage ? (
        <p className={styles.error}>{errorMessage}</p>
      ) : (
        <>
          <div className={styles.spinner} />
          <p className={styles.message}>로그인 처리 중...</p>
        </>
      )}
    </div>
  );
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className={styles.container} />}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
