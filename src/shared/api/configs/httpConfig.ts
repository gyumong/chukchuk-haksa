import * as Sentry from '@sentry/nextjs';
import { getAccessTokenStore, refreshAccessTokenStore } from '@/features/auth/tokenStore';
import { getApiBaseUrl } from '@/config/environment';
import type { ApiConfig } from '../http-client';

const BASE_URL = getApiBaseUrl();

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
      let response = await fetch(input, init);

      if (response.status === 401) {
        const headers = new Headers(init?.headers);
        if (headers.has('Authorization')) {
          const newAccessToken = await refreshAccessTokenStore();
          if (newAccessToken) {
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            response = await fetch(input, { ...init, headers });
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
