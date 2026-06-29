export const lectureEvaluationQueryKeys = {
  all: ['lecture-evaluations'] as const,
  status: () => [...lectureEvaluationQueryKeys.all, 'status'] as const,
};
