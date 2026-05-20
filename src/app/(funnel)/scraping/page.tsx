'use client';

import { useEffect, useRef } from 'react';
import { setUser } from '@sentry/nextjs';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkFailure, usePortalLinkJobPolling, usePortalLinkSummary } from '@/features/portal-link/hooks';
import { clearRetry } from '@/features/portal-link/utils/credentialRetry';
import { useFunnelContext } from '../contexts';
import ErrorScreen from '../components/ErrorScreen/ErrorScreen';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import styles from './error.module.scss';

const MISSING_JOB_MESSAGE = '연동 정보를 찾을 수 없습니다. 다시 시도해주세요.';

export default function ScrapingPage() {
  const router = useInternalRouter();
  const { jobId, setStudentInfo } = useFunnelContext();

  const { data: jobStatusData, isTimedOut } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.data?.status;
  const jobDetail = jobStatusData?.data;

  const { data: summaryData } = usePortalLinkSummary(jobId, jobStatus);
  const handledRef = useRef(false);

  const { failureMessage } = usePortalLinkFailure({
    jobStatus,
    jobDetail,
    isTimedOut,
    loginRoute: ROUTES.FUNNEL.PORTAL_LOGIN,
  });

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    if (summaryData?.data?.studentInfo) {
      handledRef.current = true;
      clearRetry();
      setStudentInfo(summaryData.data.studentInfo);
      if (jobId) {
        setUser({ id: jobId });
      }
      router.push(`${ROUTES.FUNNEL.AGREEMENT}`);
    }
  }, [summaryData, setStudentInfo, router, jobId]);

  const handleRetry = () => {
    router.push(`${ROUTES.FUNNEL.PORTAL_LOGIN}`);
  };

  if (failureMessage) {
    return (
      <div className={styles.container}>
        <ErrorScreen errorMessage={failureMessage} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  if (!jobId) {
    return (
      <div className={styles.container}>
        <ErrorScreen errorMessage={MISSING_JOB_MESSAGE} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  return <LoadingScreen />;
}
