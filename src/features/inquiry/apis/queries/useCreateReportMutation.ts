import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ReportSubmission } from '../../utils/submissionKey';
import { inquiryQueryKeys } from '../queryKey';
import { createReport } from '../service';

export function useCreateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ idempotencyKey, ...body }: ReportSubmission) => createReport(body, idempotencyKey),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryQueryKeys.list });
    },
  });
}
