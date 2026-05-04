'use client';

import { useEffect, useState } from 'react';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkJobPolling } from '@/features/portal-link/hooks';
import { getPortalLinkErrorMessage, TIMEOUT_ERROR_MESSAGE } from '@/features/portal-link/utils/errorMapping';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useInternalRouter();

  const [jobId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(RESYNC_JOB_ID_KEY);
    }
    return null;
  });

  const { data: jobStatusData, isTimedOut } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.data?.status;
  const jobDetail = jobStatusData?.data;

  useEffect(() => {
    if (jobStatus !== 'succeeded') {
      return;
    }
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
    if (isInWebView()) {
      postBridgeMessage(BRIDGE_DONE_PORTAL_LINK);
    } else {
      router.push(ROUTES.MAIN);
    }
  }, [jobStatus, router]);

  useEffect(() => {
    if (jobStatus === 'failed' && jobDetail) {
      sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
      const message = getPortalLinkErrorMessage(jobDetail);
      setErrorMessage(message);
    }
  }, [jobStatus, jobDetail]);

  useEffect(() => {
    if (isTimedOut) {
      sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
      setErrorMessage(TIMEOUT_ERROR_MESSAGE);
    }
  }, [isTimedOut]);

  const handleRetry = () => {
    router.push(ROUTES.MPA.RESYNC_LOGIN);
  };

  if (!jobId) {
    return (
      <div className={errorStyles.container}>
        <ErrorScreen errorMessage={MISSING_JOB_MESSAGE} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={errorStyles.container}>
        <ErrorScreen errorMessage={errorMessage} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  return <LoadingScreen />;
}
