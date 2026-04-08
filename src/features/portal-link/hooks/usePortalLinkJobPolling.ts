import { useQuery } from '@tanstack/react-query';
import { getJobStatus } from '../services/portalLinkService';

const POLLING_INTERVAL_MS = 2000;

export function usePortalLinkJobPolling(jobId: string | null) {
  return useQuery({
    queryKey: ['portal-link-job', jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: query => {
      const status = query.state.data?.data?.status;
      if (status === 'succeeded' || status === 'failed') return false;
      return POLLING_INTERVAL_MS;
    },
  });
}
