import * as amplitude from '@amplitude/analytics-browser';
import { ENV } from '@/config/environment';

// SDK 직접 import 는 이 모듈에서만. 다른 코드는 setAnalyticsUser/resetAnalytics/initAnalytics 만 사용.
// 향후 PostHog 등 다른 분석 도구로 교체할 때 한 곳만 수정하면 됨.

let initialized = false;

function ensureInit(): void {
  if (initialized) {
    return;
  }
  // SSR/edge 가드 — Amplitude browser SDK 는 window 의존
  if (typeof window === 'undefined') {
    return;
  }
  if (!ENV.AMPLITUDE_API_KEY) {
    // dev/preview 등 키 미설정 환경 — silent skip. console.warn 한 번만.
    // eslint-disable-next-line no-console
    console.warn('[analytics] AMPLITUDE_API_KEY missing — analytics disabled');
    initialized = true; // 재시도 막기 위해 표시
    return;
  }
  amplitude.init(ENV.AMPLITUDE_API_KEY, undefined, {
    // forms/fileDownloads/elementInteractions 는 의도적으로 OFF — 이벤트 양 과다 방지
    defaultTracking: {
      pageViews: true,
      sessions: true,
      formInteractions: false,
      fileDownloads: false,
    },
  });
  initialized = true;
}

/** 클라이언트 진입 직후 1회 호출. AnalyticsProvider 가 mount 시 발동. */
export function initAnalytics(): void {
  ensureInit();
}

/**
 * 로그인/세션 hydration 직후 호출. analyticsId 는 서버가 발급한 사용자 PK UUID.
 * 카카오 ID 나 학번 같은 의미있는 식별자는 PII 위험이 있으므로 절대 전달하지 말 것.
 *
 * null/undefined 전달 시 user_id 만 클리어 (device_id 는 유지) — 세션 만료 등 *암묵적*
 * 로그아웃 경로에서 사용. 전체 reset 은 clearAuth 의 `resetAnalytics` 가 담당.
 */
export function setAnalyticsUser(analyticsId: string | null | undefined): void {
  ensureInit();
  if (typeof window === 'undefined') {
    return;
  }
  amplitude.setUserId(analyticsId ?? undefined);
}

/**
 * 로그아웃 시 호출. device_id 가 새로 발급되어 이후 익명 이벤트가 이전 유저와 섞이지 않음.
 * 공유 브라우저에서 다른 사람이 다음에 로그인할 때 깨끗한 추적이 시작됨.
 */
export function resetAnalytics(): void {
  ensureInit();
  if (typeof window === 'undefined') {
    return;
  }
  amplitude.reset();
}
