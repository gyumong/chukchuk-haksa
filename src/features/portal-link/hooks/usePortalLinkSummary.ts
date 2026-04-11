import { useQuery } from '@tanstack/react-query';
import { getJobSummary } from '../services/portalLinkService';

export function usePortalLinkSummary(jobId: string | null, jobStatus: string | undefined) {
  return useQuery({
    queryKey: ['portal-link-summary', jobId],
    queryFn: () => getJobSummary(jobId!),
    enabled: Boolean(jobId) && jobStatus === 'succeeded',
  });
}
