import { useMemo } from 'react';
import type { NavigateOptions } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { useRouter } from 'next/navigation';
import type { ROUTES } from '@/constants/routes';

export const useInternalRouter = () => {
  const router = useRouter();

  return useMemo(() => {
    const buildUrl = (path: RoutePath, query?: Record<string, string | number>) => {
      if (!query) {
        return path;
      }
      const searchParams = new URLSearchParams();
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined) {
          searchParams.set(key, String(value));
        }
      }
      return `${path}?${searchParams.toString()}` as RoutePath;
    };

    return {
      push: (href: RoutePath, query?: Record<string, string | number>, options?: NavigateOptions) => {
        const url = buildUrl(href, query);
        return router.push(url, options);
      },
      replace: (href: RoutePath, query?: Record<string, string | number>, options?: NavigateOptions) => {
        const url = buildUrl(href, query);
        return router.replace(url, options);
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
