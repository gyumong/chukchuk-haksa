'use client';

import { useEffect, useRef } from 'react';
import { setUser } from '@sentry/nextjs';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { usePortalLinkFailure, usePortalLinkJobPolling, usePortalLinkSummary } from '@/features/portal-link/hooks';
import { clearRetry } from '@/features/portal-link/utils/credentialRetry';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { EVENTS, track, useTrackView } from '@/lib/analytics';
import ErrorScreen from '../components/ErrorScreen/ErrorScreen';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { useFunnelContext } from '../contexts';
import styles from './error.module.scss';

const MISSING_JOB_MESSAGE = '연동 정보를 찾을 수 없습니다. 다시 시도해주세요.';

export default function ScrapingPage() {
  useTrackView(EVENTS.UNIV_SYNC_LOADING_VIEW);
  const router = useInternalRouter();
  const { jobId, setStudentInfo } = useFunnelContext();
  const { hydrate } = useAuth();

  const { data: jobStatusData, isTimedOut } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.status;
  const jobDetail = jobStatusData;

  // 폴링 succeeded 시(studentInfo 확보) + 3분 타임아웃 회복 확인 시 summary 를 조회한다.
  const summaryQuery = usePortalLinkSummary(jobId, jobStatus === 'succeeded' || isTimedOut);
  const summaryData = summaryQuery.data;
  const handledRef = useRef(false);

  const { failureMessage } = usePortalLinkFailure({
    jobStatus,
    jobDetail,
    isTimedOut,
    summaryResolved: summaryQuery.isFetched,
    // 성공 판정(studentInfo)과 동일 신호로 맞춰, 성공이 확정되면 타임아웃 실패가 절대 안 뜨게 한다.
    recovered: Boolean(summaryData?.studentInfo),
    loginRoute: ROUTES.FUNNEL.PORTAL_LOGIN,
    onFailure: reason => track(EVENTS.UNIV_SYNC_FAIL, { reason }),
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
