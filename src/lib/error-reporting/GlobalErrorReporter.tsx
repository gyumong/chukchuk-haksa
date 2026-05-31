'use client';

import { useEffect } from 'react';
import { reportClientError } from './reportClientError';

// 전역 미처리 예외(window error)와 미처리 Promise 거부(unhandledrejection)를 Discord 웹훅으로도
// 보고한다 (Sentry 와 병행). 렌더 출력 없음 — 핸들러 등록 전용. 루트 layout 에 1회 마운트.
export function GlobalErrorReporter() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      reportClientError(event.error ?? new Error(event.message), { scope: 'window.onerror' });
    };
    const onRejection = (event: PromiseRejectionEvent) => {
      reportClientError(event.reason, { scope: 'unhandledrejection' });
    };

    window.addEventListener('error', onError);
    window.addEventListener('unhandledrejection', onRejection);
    return () => {
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onRejection);
    };
  }, []);

  return null;
}
