import * as Sentry from '@sentry/nextjs';
import { getAccessTokenStore, refreshAccessTokenStore } from '@/features/auth/tokenStore';
import { getApiBaseUrl } from '@/config/environment';
import type { ApiConfig } from '../http-client';

const BASE_URL = getApiBaseUrl();

// iOS WKWebView 가 connection pool 에 남은 죽은 connection 을 재사용할 때 즉시 TCP RST 를
// 받아 `TypeError: Load failed` 를 ~10ms 만에 throw 하는 케이스가 관측됨 (Sentry CCHAKSA-56).
// AWS API Gateway 처럼 짧은 idle timeout 을 가진 백엔드에서 흔하고, Chromium 은 자체 retry
// 로 가려지지만 WebKit 은 노출됨. 한 번 재시도하면 새 connection 이 만들어져 풀의 stale
// entry 를 우회 → 일시적 NETWORK_ERROR 회복. 두 번째도 throw 면 진짜 망 문제로 보고 propagate.
async function fetchWithStaleConnRetry(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  // POST/PATCH/DELETE 등 비멱등 메서드는 재시도 금지 — 첫 요청이 서버에 반영된 뒤 응답 경로에서
  // TypeError 가 났을 수 있어, 동일 요청을 한 번 더 보내면 중복 쓰기 위험. idempotency key 가
  // 있는 portal-link 같은 호출은 백엔드 단에서 중복 제거되지만, 안전을 위해 일률적으로 멱등 메서드만 재시도.
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
  const canRetry = method === 'GET' || method === 'HEAD' || method === 'OPTIONS';

  try {
    return await fetch(input, init);
  } catch (err: unknown) {
    if (err instanceof TypeError && canRetry) {
      return fetch(input, init);
    }
    throw err;
  }
}

export const createApiConfig = (): ApiConfig => ({
  baseUrl: BASE_URL,
  securityWorker: async () => {
    const accessToken = getAccessTokenStore();
    return accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {};
  },
  baseApiParams: {
    credentials: 'include',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  },
  customFetch: async (input, init) => {
    try {
      let response = await fetchWithStaleConnRetry(input, init);

      if (response.status === 401) {
        const headers = new Headers(init?.headers);
        if (headers.has('Authorization')) {
          const newAccessToken = await refreshAccessTokenStore();
          if (newAccessToken) {
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            response = await fetchWithStaleConnRetry(input, { ...init, headers });
          }
        }
      }

      return response;
    } catch (err: any) {
      Sentry.withScope(scope => {
        scope.setLevel('fatal');
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        scope.setTag('route', url);
        Sentry.captureException(err);
      });
      throw err;
    }
  },
});
