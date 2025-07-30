import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchAcademicSummary } from '../service';

export function useAcademicSummaryQuery() {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.summary(),
    queryFn: fetchAcademicSummary,
  });
}