'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkFailure, usePortalLinkJobPolling, usePortalLinkSummary } from '@/features/portal-link/hooks';
import { clearRetry } from '@/features/portal-link/utils/credentialRetry';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import { EVENTS, track, useTrackView } from '@/lib/analytics';
import { isInWebView, postBridgeMessage } from '@/lib/webview';
import ErrorScreen from '@/app/(funnel)/components/ErrorScreen/ErrorScreen';
import LoadingScreen from '@/app/(funnel)/components/LoadingScreen/LoadingScreen';
import errorStyles from '@/app/resync/scraping/error.module.scss';

// 잡 완료 시 네이티브로 보내는 신호. webview 환경 아니면 fallback 으로 main 이동.
// 프로토콜 합의는 docs/mpa-school-link-handoff.md 참조.
const BRIDGE_DONE_PORTAL_LINK = 'done:portal-link';

const MISSING_JOB_MESSAGE = '연동 정보를 찾을 수 없어요\n다시 로그인해주세요';

export default function MpaScrapingPage() {
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
    // 성공 시엔 jobId state 를 null 로 만들지 않음. 그러면 아래 MISSING_JOB_MESSAGE 가드가
    // 잘못 트리거되어 webview bridge 송출 직후(=native dismiss 전) "연동 정보를 찾을 수 없어요"
    // 화면이 표출됨. 폴링은 'succeeded' 시 refetchInterval 에서 자동 정지하므로 state 유지해도 안전.
    sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
    clearRetry();
    track(EVENTS.UNIV_RESYNC_COMPLETE);
    if (isInWebView()) {
      const posted = postBridgeMessage(BRIDGE_DONE_PORTAL_LINK);
      if (!posted) {
        // 브리지 송출 실패(race/예외) 시 LoadingScreen 에 멈추지 않도록 fallback 이동.
        // (특히 타임아웃 회복 성공 경로가 이 블록을 타므로 fallback 이 없으면 사용자가 갇힘)
        router.push(ROUTES.MAIN);
      }
    } else {
      router.push(ROUTES.MAIN);
    }
  }, [isSucceeded, router]);

  const { failureMessage } = usePortalLinkFailure({
    jobStatus,
    jobDetail,
    isTimedOut,
    summaryResolved: summaryQuery.isFetched,
    // 성공 판정(isSucceeded)과 동일 신호로 맞춰, 성공이 확정되면 타임아웃 실패가 절대 안 뜨게 한다.
    // (마지막 폴링 succeeded 가 타임아웃 직전 도착하는 race 에서도 실패가 끼어들지 않도록)
    recovered: isSucceeded,
    loginRoute: ROUTES.MPA.RESYNC_LOGIN,
    onCleanup: clearJobId,
  });

  const handleRetry = () => {
    router.push(ROUTES.MPA.RESYNC_LOGIN);
  };

  // failureMessage 를 MISSING 가드보다 먼저 본다. 실패 처리(onCleanup)가 jobId 를 null 로 만들어도
  // 타임아웃/부적격/시스템 실패 메시지가 "연동 정보를 찾을 수 없어요" 로 가려지지 않도록.
  if (failureMessage) {
    return (
      <div className={errorStyles.container}>
        <ErrorScreen errorMessage={failureMessage} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  if (isJobIdResolved && !jobId) {
    return (
      <div className={errorStyles.container}>
        <ErrorScreen errorMessage={MISSING_JOB_MESSAGE} />
        <FixedButton onClick={handleRetry}>다시 시도하기</FixedButton>
      </div>
    );
  }

  return <LoadingScreen />;
}
