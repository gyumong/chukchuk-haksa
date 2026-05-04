'use client';

import { useEffect, useState } from 'react';
import { usePortalLinkJobPolling } from '@/features/portal-link/hooks';
import { getPortalLinkErrorMessage, TIMEOUT_ERROR_MESSAGE } from '@/features/portal-link/utils/errorMapping';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import { postBridgeMessage } from '@/lib/webview';
import LoadingScreen from '../../../../(funnel)/components/LoadingScreen/LoadingScreen';

// 잡 완료 시 네이티브로 보내는 신호.
// 네이티브가 이 메시지를 받으면 webview 를 닫고 dashboard 등 후속 화면을 갱신한다.
// 프로토콜 합의는 docs/mpa-school-link-handoff.md 참조.
const BRIDGE_DONE_PORTAL_LINK = 'done:portal-link';

export default function MpaScrapingPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
    if (jobStatus === 'succeeded') {
      sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
      postBridgeMessage(BRIDGE_DONE_PORTAL_LINK);
    }
  }, [jobStatus]);

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

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!jobId) {
    throw new Error('연동 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
  }

  return <LoadingScreen />;
}
