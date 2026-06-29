import { useSuspenseQuery } from '@tanstack/react-query';
import { lectureEvaluationQueryKeys } from '../queryKey';
import { fetchLectureEvaluationStatus } from '../service';

export function useLectureEvaluationStatusQuery() {
  return useSuspenseQuery({
    queryKey: lectureEvaluationQueryKeys.status(),
    queryFn: fetchLectureEvaluationStatus,
  });
}
