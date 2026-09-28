import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryQueryKeys } from '../queryKey';
import { createReport } from '../service';

interface CreateReportVariables {
  title: string;
  content: string;
}

export function useCreateReportMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: CreateReportVariables) => createReport(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inquiryQueryKeys.list });
    },
  });
}