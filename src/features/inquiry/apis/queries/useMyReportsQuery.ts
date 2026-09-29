import { useSuspenseQuery } from '@tanstack/react-query';
import { mapToInquirySummary } from '../mappers';
import { inquiryQueryKeys } from '../queryKey';
import { getMyReports } from '../service';

export function useMyReportsQuery() {
  return useSuspenseQuery({
    queryKey: inquiryQueryKeys.list,
    queryFn: async () => {
      const page = await getMyReports({ page: 0, size: 50 });
      return (page.items ?? []).map(mapToInquirySummary);
    },
  });
}