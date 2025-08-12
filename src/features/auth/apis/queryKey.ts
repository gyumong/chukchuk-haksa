export const authQueryKeys = {
  all: ['auth'] as const,
  portalLogin: () => [...authQueryKeys.all, 'portalLogin'] as const,
} as const;