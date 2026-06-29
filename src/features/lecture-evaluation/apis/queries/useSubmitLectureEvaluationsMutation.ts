import { useMutation, useQueryClient } from '@tanstack/react-query';
import { lectureEvaluationQueryKeys } from '../queryKey';
import { submitLectureEvaluations } from '../service';

export function useSubmitLectureEvaluationsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLectureEvaluations,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: lectureEvaluationQueryKeys.status() }),
  });
}
