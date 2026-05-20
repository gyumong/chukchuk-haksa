'use client';

import { useCallback, useEffect, useState } from 'react';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkFailure, usePortalLinkJobPolling } from '@/features/portal-link/hooks';
import { clearRetry } from '@/features/portal-link/utils/credentialRetry';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import { isInWebView, postBridgeMessage } from '@/lib/webview';
import ErrorScreen from '@/app/(funnel)/components/ErrorScreen/ErrorScreen';
import LoadingScreen from '@/app/(funnel)/components/LoadingScreen/LoadingScreen';
import errorStyles from '@/app/resync/scraping/error.module.scss';

// 잡 완료 시 네이티브로 보내는 신호. webview 환경 아니면 fallback 으로 main 이동.
// 프로토콜 합의는 docs/mpa-school-link-handoff.md 참조.
const BRIDGE_DONE_PORTAL_LINK = 'done:portal-link';

const MISSING_JOB_MESSAGE = '연동 정보를 찾을 수 없어요\n다시 로그인해주세요';

export default function MpaScrapingPage() {
  const router = useInternalRouter();

  const [jobId, setJobId] = useState<string | null>(null);
  const [isJobIdResolved, setIsJobIdResolved] = useState(false);

  useEffect(() => {
    setJobId(sessionStorage.getItem(RESYNC_JOB_ID_KEY));
    setIsJobIdResolved(true);
  }, []);

  const { data: jobStatusData, isTimedOut } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.data?.status;
  const jobDetail = jobStatusData?.data;

  const clearJobId = useCallback(() => {
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
  }, []);

  useEffect(() => {
    if (jobStatus !== 'succeeded') {
      return;
    }
    clearJobId();
    clearRetry();
    if (isInWebView()) {
      postBridgeMessage(BRIDGE_DONE_PORTAL_LINK);
    } else {
      router.push(ROUTES.MAIN);
    }
  }, [jobStatus, router, clearJobId]);

  const { failureMessage } = usePortalLinkFailure({
    jobStatus,
    jobDetail,
    isTimedOut,
    loginRoute: ROUTES.MPA.RESYNC_LOGIN,
    onCleanup: clearJobId,
  });

  const handleRetry = () => {
    router.push(ROUTES.MPA.RESYNC_LOGIN);
  };

  if (isJobIdResolved && !jobId) {
    return (
      <div className={errorStyles.container}>
        <ErrorScreen errorMessage={MISSING_JOB_MESSAGE} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  if (failureMessage) {
    return (
      <div className={errorStyles.container}>
        <ErrorScreen errorMessage={failureMessage} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  return <LoadingScreen />;
}
