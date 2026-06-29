// e2e 공용 설정.
//
// 어드민/백엔드 호출 베이스 URL: FE 앱과 동일하게 getApiBaseUrl() 규칙을 따른다.
// (src/config/environment.ts:39-47 — NEXT_PUBLIC_API_BASE_URL 미설정 시 dev 백엔드 폴백)
// 미설정이면 dev.api.cchaksa.com 으로 가며, 이는 e2e 계획 문서 #3 결정과 일치한다.
export const ADMIN_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dev.api.cchaksa.com';

// FE same-origin 세션 쿠키 이름 (src/lib/auth/session.ts:6).
export const SESSION_COOKIE = 'cchaksa_session';
