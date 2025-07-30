import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchGraduationProgress } from '../service';

export function useGraduationProgressQuery() {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.graduationProgress(),
    queryFn: fetchGraduationProgress,
  });
}