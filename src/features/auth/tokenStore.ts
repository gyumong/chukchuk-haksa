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

let inFlightRefresh: Promise<string | null> | null = null;

export async function refreshAccessTokenStore(): Promise<string | null> {
  if (inFlightRefresh) {return inFlightRefresh;}

  inFlightRefresh = (async () => {
    try {
      const response = await fetch('/api/session/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        setAccessTokenStore(null);
        return null;
      }

      const data = (await response.json()) as { accessToken?: string };
      if (!data.accessToken) {
        setAccessTokenStore(null);
        return null;
      }

      setAccessTokenStore(data.accessToken);
      return data.accessToken;
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
