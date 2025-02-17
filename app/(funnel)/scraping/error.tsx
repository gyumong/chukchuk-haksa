'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import { FixedButton } from '@/components/ui';
import ErrorScreen from '../components/ErrorScreen/ErrorScreen';
import styles from './error.module.scss';

const ScrapingErrorPage = ({ error }: { error: Error }) => {
  // TODO 에러 정의 및 처리
  useEffect(() => {
    Sentry.captureException(error);
    console.log('error Message', error.message);
  }, [error]);
  const router = useRouter();

  const handleRetry = () => {
    router.push('/portal-login');
  };
  return (
    <div className={styles.container}>
      <ErrorScreen errorMessage="알 수 없는 오류가 발생했어요" />
      <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
    </div>
  );
};

export default ScrapingErrorPage;
