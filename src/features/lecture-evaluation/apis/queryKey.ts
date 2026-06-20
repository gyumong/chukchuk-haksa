export const lectureEvaluationQueryKeys = {
  all: ['lecture-evaluations'] as const,
  required: () => [...lectureEvaluationQueryKeys.all, 'required'] as const,
};
