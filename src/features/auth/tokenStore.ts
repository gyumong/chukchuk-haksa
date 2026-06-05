type Listener = (token: string | null) => void;

let currentToken: string | null = null;
const listeners = new Set<Listener>();

export function getAccessTokenStore(): string | null {
  return currentToken;
}

export function setAccessTokenStore(token: string | null): void {
  if (currentToken === token) {return;}
  currentToken = token;
  listeners.forEach(listener => listener(token));
}

export function subscribeAccessTokenStore(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/**
 * refresh 의 "전송 방식"만 추상화한다 — 새 accessToken 문자열(실패/거부 시 null)만 반환.
 * in-flight dedup 과 스칼라 write 는 refreshAccessTokenStore 가 담당하므로, transport 는
 * 순수 토큰 획득 로직만 가진다. 컨텍스트별로 교체된다: 브라우저 = BFF 쿠키, 웹뷰 = 네이티브 위임.
 */
export type RefreshTransport = () => Promise<string | null>;

// 브라우저(BFF) 기본 전송: POST /api/session/refresh. 봉인된 refresh token 은 서버만 본다.
export const defaultBrowserRefreshTransport: RefreshTransport = async () => {
  const response = await fetch('/api/session/refresh', {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    return null;
  }

  const data = (await response.json()) as { accessToken?: string };
  return data.accessToken ?? null;
};

let refreshTransport: RefreshTransport = defaultBrowserRefreshTransport;

// 컨텍스트(브라우저/웹뷰)에 맞는 refresh 전송 방식을 주입한다. AuthProvider 마운트 시 호출.
export function setRefreshTransport(transport: RefreshTransport): void {
  refreshTransport = transport;
}

let inFlightRefresh: Promise<string | null> | null = null;

export async function refreshAccessTokenStore(): Promise<string | null> {
  if (inFlightRefresh) {return inFlightRefresh;}

  inFlightRefresh = (async () => {
    try {
      const token = await refreshTransport();
      // token 이 null 이면(거부/형식오류/transport 실패) 스칼라를 비워 401→로그아웃 흐름으로.
      setAccessTokenStore(token);
      return token;
    } catch (error) {
      console.error('[tokenStore] refresh failed', error);
      setAccessTokenStore(null);
      return null;
    } finally {
      inFlightRefresh = null;
    }
  })();

  return inFlightRefresh;
}
