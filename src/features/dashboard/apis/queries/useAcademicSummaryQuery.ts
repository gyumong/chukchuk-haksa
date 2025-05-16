import { useSuspenseQuery } from '@tanstack/react-query';
import { dashboardQueryKeys } from '../queryKey';
import { fetchAcademicSummary } from '../service';

export function useAcademicSummaryQuery() {
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.academicSummary,
    queryFn: () => fetchAcademicSummary(),
    select: data => data.data.data,
  });
}
