import { trackEvent } from '@/lib/analytics/amplitude';

// 텍소노미 (Notion). 명명 규칙: `<context>_<action>_<noun>`, snake_case.
// Amplitude Console 의 event 이름과 정확히 일치시킬 것 — 분석 쿼리가 문자열 매칭.
export const EVENTS = {
  // 학교 연동 (첫 로그인 후 portal-link 흐름)
  UNIV_SYNC_LOGIN_VIEW: 'univ_sync_login_view',
  UNIV_SYNC_BTN_TAP: 'univ_sync_btn_tap',
  UNIV_SYNC_LOADING_VIEW: 'univ_sync_loading_view',
  UNIV_SYNC_TERM_AGREE_BOTTOMSHEET_VIEW: 'univ_sync_term_agree_bottomsheet_view',
  UNIV_SYNC_TERM_AGREE_VIEW: 'univ_sync_term_agree_view',
  UNIV_SYNC_COMPLETE_VIEW: 'univ_sync_complete_view',
  UNIV_SYNC_SET_GPA_BTN_TAP: 'univ_sync_set_gpa_btn_tap',
  // 외국어 학점 인증 — 텍소노미엔 등록되어 있으나 현재 웹에 해당 UI 부재.
  // 콜사이트 없이 상수만 보존 — 추후 웹에 노출되면 동일 키로 wiring (PM 확인 필요).
  UNIV_FOREIGN_LANGUAGE_CERTIFICATION_BTN_TAP: 'univ_foreign_language_certification_btn_tap',

  // 학교 재연동 (홈에서 갱신 흐름)
  HOME_UNIV_RESYNC_BTN_TAP: 'home_univ_resync_btn_tap',
  UNIV_RESYNC_BTN_TAP: 'univ_resync_btn_tap',
  UNIV_RESYNC_LOADING_VIEW: 'univ_resync_loading_view',
  UNIV_RESYNC_COMPLETE: 'univ_resync_complete',
} as const;

// 페이로드가 필요한 이벤트 — function overload 로 호출 시점에 enforce.
// 추후 페이로드 있는 이벤트가 추가되면 여기 + 아래 overload 양쪽에 추가.
export interface SetGpaTapProps {
  gpa: number;
}

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

// 페이로드 없는 이벤트 — name 만 받음.
type EventNameWithoutProps = Exclude<EventName, typeof EVENTS.UNIV_SYNC_SET_GPA_BTN_TAP>;

// 타입 안전 wrapper — amplitude.track 직접 호출 차단. overload 로 페이로드 강제.
export function track(name: typeof EVENTS.UNIV_SYNC_SET_GPA_BTN_TAP, properties: SetGpaTapProps): void;
export function track(name: EventNameWithoutProps): void;
export function track(name: EventName, properties?: SetGpaTapProps): void {
  trackEvent(name, properties as Record<string, unknown> | undefined);
}

// 호출부에서 union 타입 사용 시를 위한 helper — useTrackView 처럼 view 이벤트 전용 hook 에 사용.
export type ViewEventName = EventNameWithoutProps;
