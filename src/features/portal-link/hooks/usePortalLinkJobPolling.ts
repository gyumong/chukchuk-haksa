import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ENV } from '@/config/environment';
import { getJobStatus } from '../services/portalLinkService';

const POLLING_INTERVAL_MS = 2000;

export function usePortalLinkJobPolling(jobId: string | null) {
  const startedAtRef = useRef<number | null>(null);
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    setIsTimedOut(false);
    startedAtRef.current = jobId ? Date.now() : null;
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
      if (startedAtRef.current && Date.now() - startedAtRef.current >= ENV.PORTAL_LINK_TIMEOUT_MS) {
        setIsTimedOut(true);
        return false;
      }
      return POLLING_INTERVAL_MS;
    },
  });

  return { ...query, isTimedOut };
}
