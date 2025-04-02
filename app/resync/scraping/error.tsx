'use client';

import { useEffect } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import * as Sentry from '@sentry/nextjs';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import ErrorScreen from '../../(funnel)/components/ErrorScreen/ErrorScreen';
import styles from './error.module.scss';

const ScrapingErrorPage = ({ error }: { error: Error }) => {
  // TODO 에러 정의 및 처리
  useEffect(() => {
    Sentry.captureException(error);
    console.log('error Message', error.message);
  }, [error]);
  const router = useInternalRouter();

  const handleRetry = () => {
    router.push(`${ROUTES.RESYNC.LOGIN}`);
  };
  return (
    <div className={styles.container}>
      <ErrorScreen errorMessage={error.message} />
      <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
    </div>
  );
};

export default ScrapingErrorPage;
