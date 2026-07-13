import type { SearchCourseOfferingsParams } from '@/shared/api/data-contracts';

export const adminQueryKeys = {
  all: ['admin'] as const,
  testOptions: () => [...adminQueryKeys.all, 'testOptions'] as const,
  departments: (keyword: string) => [...adminQueryKeys.all, 'departments', keyword] as const,
  courseOfferings: (params: SearchCourseOfferingsParams) => [...adminQueryKeys.all, 'courseOfferings', params] as const,
  graduationCourses: () => [...adminQueryKeys.all, 'graduationCourses'] as const,
} as const;
