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
 * 로그인/세션 hydration 직후 호출. analyticsId 는 서버가 발급한 사용자 PK UUID — user_id 로 사용.
 * 학번/학과 등 개인 식별 속성은 제품 결정에 따라 UserProperty 로 전송하지 않는다 — 웹이 attach 하는
 * UserProperty 는 `sys_web_version` 뿐(userProperties.ts / AnalyticsProvider). 비밀번호·카카오 원본 토큰
 * 등 인증 시크릿도 절대 전달 금지.
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
  // 로그인 user 식별 직후 — 과거 빌드가 user_id 프로필에 남긴 레거시 학적 UserProperty 정리(일회성).
  // 순서 critical: unset 은 반드시 setUserId *뒤* — 그래야 올바른 user 프로필에 적용된다(앞에 두면
  // 이전 user/익명 device 프로필에 잘못 적용). 키 미설정(dev/preview)이면 SDK 가 init 되지 않으므로 skip.
  if (analyticsId && ENV.AMPLITUDE_API_KEY) {
    clearLegacyAcademicUserProperties(analyticsId);
  }
}

// 레거시 정리(일회성 마이그레이션). 과거 빌드는 학번·학과·전공·입학년도·학년·복수전공을 user_id
// 프로필의 UserProperty 로 attach 했다. 이제 전송은 중단했지만(userProperties.ts), 그것만으로는
// 이미 저장된 기존 유저의 값이 Amplitude 에 그대로 남는다 — 아래에서 능동적으로 unset 한다.
// analyticsId(로그인 user) 단위 localStorage 플래그로 디바이스당 1회만 전송.
// 모든 활성 유저가 한 번씩 재방문해 정리되면 이 블록(상수 + 두 헬퍼 + 위 호출)은 안전하게 제거 가능.
const LEGACY_ACADEMIC_USER_PROPS = [
  'student_code',
  'department',
  'major',
  'admission_year',
  'grade_level',
  'dual_major',
] as const;

function legacyCleanupFlagKey(analyticsId: string): string {
  return `amplitude:legacy-academic-props-cleared:v1:${analyticsId}`;
}

// localStorage 가 차단된 환경(프라이버시/인코그니토)에서도 페이지 세션당 1회로 묶기 위한 in-memory 가드.
// localStorage 가 정상이면 디바이스 영구 1회, 차단되면 이 Set 이 세션 1회를 보장(매 hydration 중복 전송 방지).
const legacyCleanedThisSession = new Set<string>();

/**
 * 기존 user_id 프로필에 남아있는 학적 UserProperty 를 unset. analyticsId 단위.
 * localStorage 정상: 디바이스당 1회(영구). localStorage 차단: 세션당 1회(in-memory).
 * unset 은 idempotent 라 혹시 중복 전송돼도 무해.
 */
function clearLegacyAcademicUserProperties(analyticsId: string): void {
  if (legacyCleanedThisSession.has(analyticsId)) {
    return;
  }

  const flagKey = legacyCleanupFlagKey(analyticsId);
  try {
    if (localStorage.getItem(flagKey)) {
      legacyCleanedThisSession.add(analyticsId);
      return; // 이 디바이스에선 이미 정리함
    }
  } catch {
    // localStorage 차단 — in-memory 가드(legacyCleanedThisSession)로 세션 1회 보장.
  }

  const identify = new amplitude.Identify();
  for (const key of LEGACY_ACADEMIC_USER_PROPS) {
    identify.unset(key);
  }

  // in-memory 가드는 즉시 세팅 — 같은 세션 내 동시/재호출의 중복 전송을 막는다.
  legacyCleanedThisSession.add(analyticsId);

  // localStorage 영구 플래그는 전송이 성공(code 200)한 뒤에만 기록한다. 즉시 기록하면 전송이
  // 실패해도 "정리 완료" 로 남아 다음 세션에서 재시도되지 않는다 → 레거시 학적 값이 영구히 남는다.
  amplitude
    .identify(identify)
    .promise.then(result => {
      if (result.code !== 200) {
        return; // 전송 실패 — 영구 플래그 미기록 → 다음 hydration 에서 재시도
      }
      try {
        localStorage.setItem(flagKey, '1');
      } catch {
        // 플래그 저장 실패 — in-memory 가드가 세션 1회를 막아줌. 무시.
      }
    })
    .catch(() => {
      // 전송 거부 — 영구 플래그 미기록으로 다음 세션 재시도. 무시.
    });
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

/**
 * 이벤트 전송 내부 헬퍼. 타입 안전 wrapper 는 `events.ts` 의 `track()` 이며,
 * 호출부는 항상 그쪽을 사용한다. SDK 직접 호출 차단을 위해 internal 로 분리.
 */
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  ensureInit();
  if (typeof window === 'undefined') {
    return;
  }
  amplitude.track(name, properties);
}

/**
 * UserProperties 설정 내부 헬퍼. Identify API 로 user-level attach — event properties 와 분리되어
 * 사용자 단위로 유지된다. 타입 안전 wrapper 는 `userProperties.ts` 의 `setUserProperties()`.
 */
export function setUserPropertiesInternal(props: Record<string, string | number | boolean>): void {
  ensureInit();
  if (typeof window === 'undefined') {
    return;
  }
  const identify = new amplitude.Identify();
  for (const [key, value] of Object.entries(props)) {
    identify.set(key, value);
  }
  amplitude.identify(identify);
}
