import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ENV } from '@/config/environment';
import { getJobStatus } from '../services/portalLinkService';

const POLLING_INTERVAL_MS = 2000;

export function usePortalLinkJobPolling(jobId: string | null) {
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    setIsTimedOut(false);
    if (!jobId) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsTimedOut(true);
    }, ENV.PORTAL_LINK_TIMEOUT_MS);

    return () => clearTimeout(timeoutId);
  }, [jobId]);

  const query = useQuery({
    queryKey: ['portal-link-job', jobId],
    queryFn: () => getJobStatus(jobId!),
    enabled: Boolean(jobId) && !isTimedOut,
    refetchInterval: q => {
      const status = q.state.data?.data?.status;
      if (status === 'succeeded' || status === 'failed') {
        return false;
      }
      if (isTimedOut) {
        return false;
      }
      return POLLING_INTERVAL_MS;
    },
  });

  return {
    data: query.data,
    isTimedOut,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
