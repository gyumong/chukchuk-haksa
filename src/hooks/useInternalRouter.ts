import { useMemo } from 'react';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import type { ROUTES } from '@/constants/routes';
import { isInWebView, navigateBack } from '@/lib/webview';

export const useInternalRouter = () => {
  const router = useRouter();

  return useMemo(() => {
    const buildUrl = (
      basePath: RoutePath,
      options?: {
        params?: Array<string | number>;
        query?: Record<string, string | number>;
      }
    ) => {
      const { params, query } = options ?? {};

      let url = basePath;
      if (params && params.length > 0) {
        url += '/' + params.map(String).join('/');
      }

      if (query && Object.keys(query).length > 0) {
        const searchParams = new URLSearchParams();
        Object.entries(query)
          .filter(([_, value]) => value !== undefined)
          .forEach(([key, value]) => {
            searchParams.set(key, String(value));
          });
        url += `?${searchParams.toString()}`;
      }

      return url as RoutePath;
    };

    return {
      push: (
        href: RoutePath,
        options?: {
          params?: Array<string | number>;
          query?: Record<string, string | number>;
        },
        navigateOptions?: NavigateOptions
      ) => {
        const url = buildUrl(href, options);
        return router.push(url, navigateOptions);
      },

      replace: (
        href: RoutePath,
        options?: {
          params?: Array<string | number>;
          query?: Record<string, string | number>;
        },
        navigateOptions?: NavigateOptions
      ) => {
        const url = buildUrl(href, options);
        return router.replace(url, navigateOptions);
      },

      back: () => {
        // 실제 뒤로가기는 항상 웹이 수행한다. 웹뷰일 때는 네이티브에도 알려(앱바 동기화 등) 주지만,
        // 네이티브는 이 알림으로 직접 이동하지 않는다(이동 시 router.back() 과 중복). 프로토콜: M3.
        if (isInWebView()) {
          navigateBack();
        }
        router.back();
      },
      forward: () => router.forward(),
      refresh: () => router.refresh(),
    };
  }, [router]);
};

type FlattenRoutes<T> = T extends string
  ? T
  : {
      [K in keyof T]: FlattenRoutes<T[K]>;
    }[keyof T];

export type RoutePath = FlattenRoutes<typeof ROUTES>;
