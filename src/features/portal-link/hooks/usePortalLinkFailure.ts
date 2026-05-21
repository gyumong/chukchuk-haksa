import { useEffect, useRef, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { useInternalRouter, type RoutePath } from '@/hooks/useInternalRouter';
import type { JobStatusResponse } from '@/shared/api/data-contracts';
import { stashRetryCode } from '../utils/credentialRetry';
import { classifyPortalLinkFailure, TIMEOUT_ERROR_MESSAGE } from '../utils/errorMapping';

interface UsePortalLinkFailureParams {
  jobStatus?: string;
  jobDetail?: JobStatusResponse;
  isTimedOut: boolean;
  /** 자격증명 실패 시 복귀할 로그인 라우트. */
  loginRoute: RoutePath;
  /** 실패 처리 직전 정리 (예: sessionStorage jobId 제거). */
  onCleanup?: () => void;
}

/**
 * 포털 연동 job 실패를 분류해 처리한다.
 * - credential: 학번 보존을 위해 코드를 stash 하고 로그인 폼으로 복귀 (Sentry 미보고)
 * - ineligible: 인라인 에러 메시지 노출 (Sentry 미보고)
 * - system / timeout: 인라인 에러 + Sentry 1회 보고
 *
 * credential 은 즉시 navigate 하므로 failureMessage 는 null 로 유지된다.
 */
export function usePortalLinkFailure({
  jobStatus,
  jobDetail,
  isTimedOut,
  loginRoute,
  onCleanup,
}: UsePortalLinkFailureParams) {
  const router = useInternalRouter();
  const [failureMessage, setFailureMessage] = useState<string | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    if (jobStatus === 'failed' && jobDetail) {
      handledRef.current = true;
      const { kind, code, message, shouldCapture } = classifyPortalLinkFailure(jobDetail);
      onCleanup?.();

      if (kind === 'credential') {
        stashRetryCode(code);
        router.push(loginRoute);
        return;
      }

      if (shouldCapture) {
        captureException(new Error(`[portal-link] failed: ${code || 'UNKNOWN'}`));
      }
      setFailureMessage(message);
    }
  }, [jobStatus, jobDetail, loginRoute, onCleanup, router]);

  useEffect(() => {
    if (handledRef.current) {
      return;
    }
    if (isTimedOut) {
      handledRef.current = true;
      onCleanup?.();
      captureException(new Error('[portal-link] timeout'));
      setFailureMessage(TIMEOUT_ERROR_MESSAGE);
    }
  }, [isTimedOut, onCleanup]);

  return { failureMessage };
}
