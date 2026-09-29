import { useSuspenseQuery } from '@tanstack/react-query';
import { mapToInquiryDetail } from '../mappers';
import { inquiryQueryKeys } from '../queryKey';
import { getReportDetail } from '../service';

export function useReportDetailQuery(reportId: string) {
  return useSuspenseQuery({
    queryKey: inquiryQueryKeys.detail(reportId),
    queryFn: async () => {
      const detail = await getReportDetail(reportId);
      return mapToInquiryDetail(detail);
    },
  });
}