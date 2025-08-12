import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchSemesterList } from '../service';

export function useSemesterListQuery() {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.semesters(),
    queryFn: fetchSemesterList,
  });
}