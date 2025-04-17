import { useMemo } from 'react';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import type { ROUTES } from '@/constants/routes';

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

      back: () => router.back(),
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
