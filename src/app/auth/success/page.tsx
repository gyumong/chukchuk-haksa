'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { type RoutePath, useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './success.module.scss';

const SuccessContent = () => {
  const router = useInternalRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const redirect = (searchParams.get('redirect') as RoutePath) || '/main';

    const hydrate = async () => {
      try {
        const response = await fetch('/api/session', { credentials: 'include' });
        if (!response.ok) {
          router.replace('/');
          return;
        }
        router.replace(redirect);
      } catch (error) {
        console.error('[auth/success] session hydrate failed', error);
        router.replace('/');
      }
    };

    hydrate();
  }, [router, searchParams]);

  return <div className={styles.container} />;
};

const SuccessPage = () => {
  return (
    <Suspense fallback={<div className={styles.container} />}>
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessPage;
