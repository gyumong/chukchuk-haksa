import { readNativeAuth, requestNativeRefresh, signalNativeLogout } from '@/lib/webview';
import type { AuthStrategy, SessionState } from './types';

// 웹뷰(네이티브 소유 토큰) 인증: cchaksa_session 쿠키를 쓰지 않는다.
// - hydrate: 네이티브가 주입한 글로벌(window.__NATIVE_AUTH__)을 동기 read — GET /api/session 없음
// - refresh: 네이티브에 위임(응답 브릿지). refresh token 은 웹뷰 JS 에 들어오지 않는다
// - clear:   네이티브에 로그아웃 신호(단방향). 쿠키가 없으니 DELETE 불필요
// 이 전략은 selectStrategy() 가 capability 를 확인했을 때만 선택된다(아니면 browser fallback).

async function hydrate(): Promise<SessionState | null> {
  const payload = readNativeAuth();
  if (!payload) {
    return null;
  }
  return {
    accessToken: payload.accessToken,
    isPortalLinked: payload.isPortalLinked,
    analyticsId: payload.analyticsId,
  };
}

async function clear(): Promise<void> {
  // best-effort: AuthStrategy.clear 계약상 throw 하지 않는다.
  try {
    signalNativeLogout();
  } catch (error) {
    console.error('[auth:webview] signalNativeLogout failed', error);
  }
}

export const webviewStrategy: AuthStrategy = {
  hydrate,
  clear,
  refreshTransport: requestNativeRefresh,
};
