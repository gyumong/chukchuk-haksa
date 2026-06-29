import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lectureEvaluationQueryKeys } from '../queryKey';
import { skipLectureEvaluation } from '../service';

export function useSkipLectureEvaluationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: skipLectureEvaluation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lectureEvaluationQueryKeys.status() }),
  });
}
