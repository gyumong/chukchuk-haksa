import type { ROUTES } from "@/constants/routes";
import type { NavigateOptions } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export const useInternalRouter = () => {
  const router = useRouter();

  return useMemo(() => {
    return {
      push: (href: RoutePath, options?: NavigateOptions) => router.push(href, options),
      replace: (href: RoutePath, options?: NavigateOptions) => router.replace(href, options),
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