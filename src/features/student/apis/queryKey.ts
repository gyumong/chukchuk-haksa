export const studentQueryKeys = {
  all: ['student'] as const,
  profile: () => [...studentQueryKeys.all, 'profile'] as const,
  targetGpa: () => [...studentQueryKeys.all, 'targetGpa'] as const,
} as const;