import * as Sentry from '@sentry/nextjs';
import { getAccessToken } from '@/lib/auth/token';
import { getApiBaseUrl } from '@/config/environment';
import type { ApiConfig } from '../http-client';

const BASE_URL = getApiBaseUrl();

export const createApiConfig = (): ApiConfig => ({
  baseUrl: BASE_URL,
  securityWorker: async () => {
    try {
      const accessToken = getAccessToken();
      return accessToken
        ? {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        : {};
    } catch {
      return {};
    }
  },
  baseApiParams: {
    credentials: 'include',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  },
  customFetch: async (...args) => {
    try {
      return await fetch(...args);
    } catch (err: any) {
      Sentry.withScope(scope => {
        scope.setLevel('fatal');
        if (args.length) {
          const url = typeof args[0] === 'string' ? args[0] : args[0] instanceof URL ? args[0].href : args[0].url;
          scope.setTag('route', url);
        }
        Sentry.captureException(err);
      });
      throw err;
    }
  },
});
