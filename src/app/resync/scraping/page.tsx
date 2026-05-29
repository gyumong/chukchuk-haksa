'use client';

import { useCallback, useEffect, useState } from 'react';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkFailure, usePortalLinkJobPolling } from '@/features/portal-link/hooks';
import { clearRetry } from '@/features/portal-link/utils/credentialRetry';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import ErrorScreen from '@/app/(funnel)/components/ErrorScreen/ErrorScreen';
import LoadingScreen from '@/app/(funnel)/components/LoadingScreen/LoadingScreen';
import styles from './error.module.scss';

const MISSING_JOB_MESSAGE = '연동 정보를 찾을 수 없습니다. 다시 로그인해주세요.';

export default function ScrapingPage() {
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

  const clearJobId = useCallback(() => {
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
    setJobId(null);
  }, []);

  useEffect(() => {
    if (jobStatus === 'succeeded') {
      // 성공 시엔 jobId state 를 null 로 만들지 않음. setJobId(null) + router.push 가
      // 같은 tick 에 배치되면 unmount 전 재렌더에서 MISSING_JOB_MESSAGE 가 깜빡일 수 있음.
      // 폴링은 'succeeded' 시 refetchInterval 에서 자동 정지하므로 state 유지해도 안전.
      sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
      clearRetry();
      router.push(ROUTES.MAIN);
    }
  }, [jobStatus, router]);

  const { failureMessage } = usePortalLinkFailure({
    jobStatus,
    jobDetail,
    isTimedOut,
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
