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
  /**
   * 타임아웃 시 summary 재확인이 끝났는지 여부. true 가 되기 전엔 타임아웃을 실패로 확정하지 않고
   * 로딩을 유지한다. 기본 true — summary 회복을 쓰지 않는 호출부는 기존(즉시 실패) 동작 유지.
   */
  summaryResolved?: boolean;
  /** 타임아웃이지만 summary 로 실제 성공이 확인됨 — 실패 처리하지 않는다(성공 핸들러가 처리). */
  recovered?: boolean;
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
  summaryResolved = true,
  recovered = false,
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
    // 타임아웃이어도 summary 재확인이 끝나기 전(summaryResolved=false)엔 실패로 확정하지 않는다.
    // summary 가 성공을 확인하면(recovered) 성공 핸들러가 처리하므로 여기선 실패 처리하지 않는다.
    if (isTimedOut && summaryResolved && !recovered) {
      handledRef.current = true;
      onCleanup?.();
      captureException(new Error('[portal-link] timeout'));
      setFailureMessage(TIMEOUT_ERROR_MESSAGE);
    }
  }, [isTimedOut, summaryResolved, recovered, onCleanup]);

  return { failureMessage };
}
