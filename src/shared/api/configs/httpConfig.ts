// import { cookies } from 'next/headers';
import * as Sentry from '@sentry/nextjs';
import type { ApiConfig } from '../http-client';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'https://dev.api.cchaksa.com';

export const createApiConfig = (): ApiConfig => ({
  baseUrl: BASE_URL,
  securityWorker: async () => {
    try {
      // const cookieStore = cookies();
      // const cookieJar = (await cookieStore)
      //   .getAll()
      //   .map(({ name, value }) => `${name}=${value}`)
      //   .join('; ');
      // return cookieJar ? { headers: { Cookie: cookieJar } } : {};
    } catch {
      return {};
    }
  },
  baseApiParams: {
    cache: 'no-store',
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
          const url = typeof args[0] === 'string' ? args[0] : args[0].url;
          scope.setTag('route', url);
        }
        Sentry.captureException(err);
      });
      throw err;
    }
  },
});
