import { useMemo } from 'react';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/routes';
import { navigateBack } from '@/lib/webview';

// (funnel) 그룹 경로. 이 경로들에서는 뒤로가기를 네이티브에 위임하지 않고 웹이 자체 처리한다.
// 현재 funnel 은 back() 을 호출하지 않으나, 향후 추가 시 퍼널 전체가 닫히는 것을 막는 방어 가드.
const FUNNEL_PATHS = new Set<string>(Object.values(ROUTES.FUNNEL));

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
        // usePathname() 은 이 훅을 쓰는 다수 컴포넌트를 매 라우팅마다 리렌더시키므로 쓰지 않고,
        // 클릭 시점(클라이언트)에만 현재 경로를 읽어 구독 없이 판정한다.
        const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
        // 비-funnel 경로 & 웹뷰면 navigateBack 을 네이티브로 송출하고 위임. 그 외엔 기존대로 router.back().
        if (!FUNNEL_PATHS.has(pathname) && navigateBack()) {
          return;
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
