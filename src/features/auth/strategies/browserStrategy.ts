import { defaultBrowserRefreshTransport } from '../tokenStore';
import type { AuthStrategy, SessionState } from './types';

// 브라우저(BFF) 인증: cchaksa_session 봉인 쿠키 기반. 기존 AuthContext.fetchSessionState /
// clearAuth 의 DELETE / tokenStore 의 POST-refresh 를 그대로 옮긴 것 — 행동 동일.

async function hydrate(): Promise<SessionState | null> {
  try {
    const response = await fetch('/api/session', { credentials: 'include' });
    if (!response.ok) {
      return { accessToken: null, isPortalLinked: null, analyticsId: null };
    }
    const data = (await response.json()) as {
      accessToken?: string;
      isPortalLinked?: boolean;
      analyticsId?: string;
    };
    return {
      accessToken: typeof data.accessToken === 'string' ? data.accessToken : null,
      isPortalLinked: typeof data.isPortalLinked === 'boolean' ? data.isPortalLinked : null,
      analyticsId: typeof data.analyticsId === 'string' ? data.analyticsId : null,
    };
  } catch (error) {
    console.error('[auth:browser] session fetch failed', error);
    return null;
  }
}

async function clear(): Promise<void> {
  try {
    await fetch('/api/session', { method: 'DELETE', credentials: 'include' });
  } catch (error) {
    console.error('[auth:browser] clear request failed', error);
  }
}

export const browserStrategy: AuthStrategy = {
  hydrate,
  clear,
  refreshTransport: defaultBrowserRefreshTransport,
};
