'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkFailure, usePortalLinkJobPolling, usePortalLinkSummary } from '@/features/portal-link/hooks';
import { clearRetry } from '@/features/portal-link/utils/credentialRetry';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import { EVENTS, track, useTrackView } from '@/lib/analytics';
import ErrorScreen from '@/app/(funnel)/components/ErrorScreen/ErrorScreen';
import LoadingScreen from '@/app/(funnel)/components/LoadingScreen/LoadingScreen';
import styles from './error.module.scss';

const MISSING_JOB_MESSAGE = '연동 정보를 찾을 수 없습니다. 다시 로그인해주세요.';

export default function ScrapingPage() {
  useTrackView(EVENTS.UNIV_RESYNC_LOADING_VIEW);
  const router = useInternalRouter();

  const [jobId, setJobId] = useState<string | null>(null);
  const [isJobIdResolved, setIsJobIdResolved] = useState(false);

  useEffect(() => {
    setJobId(sessionStorage.getItem(RESYNC_JOB_ID_KEY));
    setIsJobIdResolved(true);
  }, []);

  const { data: jobStatusData, isTimedOut } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.status;
  const jobDetail = jobStatusData;

  // 3분 타임아웃 직후 마지막 폴링을 놓친 경우, summary 로 실제 성공 여부를 한 번 더 확인한다.
  const summaryQuery = usePortalLinkSummary(jobId, isTimedOut);
  const summaryData = summaryQuery.data;
  // 폴링 succeeded 거나, 타임아웃 후 summary 가 succeeded 면 성공으로 처리한다.
  const isSucceeded = jobStatus === 'succeeded' || summaryData?.status === 'succeeded';
  const succeededRef = useRef(false);

  const clearJobId = useCallback(() => {
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
    setJobId(null);
  }, []);

  useEffect(() => {
    if (succeededRef.current || !isSucceeded) {
      return;
    }
    succeededRef.current = true;
    // 성공 시엔 jobId state 를 null 로 만들지 않음. setJobId(null) + router.push 가
    // 같은 tick 에 배치되면 unmount 전 재렌더에서 MISSING_JOB_MESSAGE 가 깜빡일 수 있음.
    // 폴링은 'succeeded' 시 refetchInterval 에서 자동 정지하므로 state 유지해도 안전.
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
    clearRetry();
    track(EVENTS.UNIV_RESYNC_COMPLETE);
    router.push(ROUTES.MAIN);
  }, [isSucceeded, router]);

  const { failureMessage } = usePortalLinkFailure({
    jobStatus,
    jobDetail,
    isTimedOut,
    summaryResolved: summaryQuery.isFetched,
    // 성공 판정(isSucceeded)과 동일 신호로 맞춰, 성공이 확정되면 타임아웃 실패가 절대 안 뜨게 한다.
    // (마지막 폴링 succeeded 가 타임아웃 직전 도착하는 race 에서도 실패가 끼어들지 않도록)
    recovered: isSucceeded,
    loginRoute: ROUTES.RESYNC.LOGIN,
    onCleanup: clearJobId,
  });

  const handleRetry = () => {
    router.push(ROUTES.RESYNC.LOGIN);
  };

  if (failureMessage) {
    return (
      <div className={styles.container}>
        <ErrorScreen errorMessage={failureMessage} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  if (isJobIdResolved && !jobId) {
    return (
      <div className={styles.container}>
        <ErrorScreen errorMessage={MISSING_JOB_MESSAGE} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  return <LoadingScreen />;
}
