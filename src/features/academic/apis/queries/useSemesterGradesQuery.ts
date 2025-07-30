import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchSemesterGrades } from '../service';

export function useSemesterGradesQuery() {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.semesterGrades(),
    queryFn: fetchSemesterGrades,
  });
}