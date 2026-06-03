import type { RefreshTransport } from '../tokenStore';

// 마운트/hydrate 가 채우는 세션 상태. AuthContext.applySessionState 가 그대로 소비한다.
export interface SessionState {
  accessToken: string | null;
  isPortalLinked: boolean | null;
  analyticsId: string | null;
}

/**
 * 인증 컨텍스트별 전략. 토큰 "획득/갱신/정리"라는 얇은 한 겹만 갈리고,
 * 그 아래(Bearer 호출·ProtectedRoute·React Query)는 양 전략이 공유한다.
 * - browser: cchaksa_session 봉인 쿠키 (GET/POST-refresh/DELETE on /api/session)
 * - webview: 네이티브가 토큰 소유 (주입 글로벌 read + 네이티브 refresh 위임)
 */
export interface AuthStrategy {
  /** 마운트/명시적 hydrate. null = 직전 상태 유지(네트워크 실패 등). */
  hydrate: () => Promise<SessionState | null>;
  /** 로그아웃 정리. best-effort — throw 하지 않는다. */
  clear: () => Promise<void>;
  /** tokenStore 에 설치되는 refresh 전송 방식. dedup 은 tokenStore 가 담당. */
  refreshTransport: RefreshTransport;
}
