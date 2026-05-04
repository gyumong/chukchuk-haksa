/**
 * 배포 환경 기반 설정 관리
 * 환경변수를 우선으로 하고, fallback만 제공
 */

/**
 * 현재 환경 감지 (Vercel / Cloudflare Pages 병행)
 */
export function getEnvironment() {
  // 명시적 환경변수 우선
  if (process.env.NEXT_PUBLIC_DEPLOY_ENV) {
    return process.env.NEXT_PUBLIC_DEPLOY_ENV;
  }

  // Vercel 환경
  if (process.env.VERCEL_ENV) {
    return process.env.VERCEL_ENV;
  }

  // Cloudflare Pages 환경
  if (process.env.CF_PAGES_BRANCH === 'main') {
    return 'production';
  }
  if (process.env.CF_PAGES) {
    return 'preview';
  }

  // 로컬 개발 환경
  if (process.env.NODE_ENV === 'development') {
    return 'development';
  }

  return 'development';
}

/**
 * API Base URL 가져오기 (환경변수 우선)
 */
export function getApiBaseUrl() {
  // 환경변수가 설정되어 있으면 사용
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // fallback (로컬 개발용)
  return 'https://dev.api.cchaksa.com';
}

/**
 * Frontend URL 가져오기 (환경별 로직)
 */
export function getFrontendUrl() {
  // 클라이언트 환경변수 우선 사용
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL;
  }

  // 브라우저에서는 현재 origin 사용
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // fallback (로컬 개발용)
  return 'http://localhost:3000';
}

const PORTAL_LINK_DEFAULT_TIMEOUT_MS = 3 * 60 * 1000;
const parsedPortalLinkTimeoutMs = Number(process.env.NEXT_PUBLIC_PORTAL_LINK_TIMEOUT_MS);
const portalLinkTimeoutMs =
  Number.isFinite(parsedPortalLinkTimeoutMs) && parsedPortalLinkTimeoutMs > 0
    ? parsedPortalLinkTimeoutMs
    : PORTAL_LINK_DEFAULT_TIMEOUT_MS;

/**
 * 환경변수 중앙 관리
 */
export const ENV = {
  // URLs
  API_BASE_URL: getApiBaseUrl(),
  FRONTEND_URL: getFrontendUrl(),
  
  // 카카오 API
  KAKAO_JS_KEY: process.env.NEXT_PUBLIC_JAVASCRIPT_KEY!,
  KAKAO_REST_API_KEY: process.env.REST_API_KEY!,
  KAKAO_CLIENT_SECRET: process.env.CLIENT_SECRET!,
  
  // Supabase (레거시)
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SUPABASE_PROJECT_ID: process.env.SUPABASE_PROJECT_ID!,
  SESSION_SECRET: process.env.SESSION_SECRET!,
  
  // 외부 서비스
  LAMBDA_DEV_URL: process.env.LAMBDA_DEV_URL ?? '',
  AWS_SCRAPER_URL: process.env.AWS_URL ?? '',
  
  // 모니터링
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN ?? '',
  SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN ?? '',
  
  // 캐시
  REDIS_URL: process.env.UPSTASH_REDIS_REST_URL ?? '',
  REDIS_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ?? '',
  
  // 유지보수
  MAINTENANCE_MODE: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true',
  MAINTENANCE_MESSAGE: process.env.NEXT_PUBLIC_MAINTENANCE_MESSAGE ?? '',

  // 서버
  PORT: Number(process.env.PORT) || 3000,

  // 포털 연동 폴링 타임아웃 (ms). 환경변수 미설정/비정상 값(음수, NaN 등)은 기본 3분.
  PORTAL_LINK_TIMEOUT_MS: portalLinkTimeoutMs,

  // 네이티브 → BFF 토큰 익스체인지(POST /api/session) 게이트 시크릿.
  // 미설정 시 엔드포인트가 503 으로 비활성화. 모바일 ↔ 백엔드 간 사전 합의 후 주입.
  NATIVE_SESSION_EXCHANGE_SECRET: process.env.NATIVE_SESSION_EXCHANGE_SECRET ?? null,
} as const;