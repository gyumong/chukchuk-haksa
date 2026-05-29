'use client';

import { useEffect, useRef } from 'react';
import { setUser } from '@sentry/nextjs';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useAuth } from '@/features/auth/contexts/AuthContext';
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
  const { hydrate } = useAuth();

  const { data: jobStatusData, isTimedOut } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.status;
  const jobDetail = jobStatusData;

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
    if (summaryData?.studentInfo) {
      handledRef.current = true;
      clearRetry();
      setStudentInfo(summaryData.studentInfo);
      if (jobId) {
        setUser({ id: jobId });
      }
      // 학교 연동 성공 시점에 AuthContext 와 cchaksa_session 쿠키의 isPortalLinked 를
      // 백엔드 probe 기반으로 false → true 로 승격. 이게 없으면 /target-score 와 /main 의
      // ProtectedRoute(requirePortalLinked=true) 가 stale false 를 보고 사용자를 / 로 튕김.
      void hydrate().finally(() => {
        router.push(`${ROUTES.FUNNEL.AGREEMENT}`);
      });
    }
  }, [summaryData, setStudentInfo, router, jobId, hydrate]);

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
