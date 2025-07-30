export const userQueryKeys = {
  all: ['user'] as const,
  delete: () => [...userQueryKeys.all, 'delete'] as const,
} as const;