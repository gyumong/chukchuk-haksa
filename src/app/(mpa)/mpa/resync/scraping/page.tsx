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
  const jobStatus = jobStatusData?.status;
  const jobDetail = jobStatusData;

  const clearJobId = useCallback(() => {
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
    setJobId(null);
  }, []);

  useEffect(() => {
    if (jobStatus !== 'succeeded') {
      return;
    }
    // 성공 시엔 jobId state 를 null 로 만들지 않음. 그러면 아래 MISSING_JOB_MESSAGE 가드가
    // 잘못 트리거되어 webview bridge 송출 직후(=native dismiss 전) "연동 정보를 찾을 수 없어요"
    // 화면이 표출됨. 폴링은 'succeeded' 시 refetchInterval 에서 자동 정지하므로 state 유지해도 안전.
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
    clearRetry();
    if (isInWebView()) {
      postBridgeMessage(BRIDGE_DONE_PORTAL_LINK);
    } else {
      router.push(ROUTES.MAIN);
    }
  }, [jobStatus, router]);

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
