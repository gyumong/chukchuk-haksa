'use client';

import { useEffect, useState } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkJobPolling } from '@/features/portal-link/hooks';
import { getPortalLinkErrorMessage } from '@/features/portal-link/utils/errorMapping';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import LoadingScreen from '../../(funnel)/components/LoadingScreen/LoadingScreen';

export default function ScrapingPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useInternalRouter();

  const [jobId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(RESYNC_JOB_ID_KEY);
    }
    return null;
  });

  const { data: jobStatusData } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.data?.status;
  const jobDetail = jobStatusData?.data;

  useEffect(() => {
    if (jobStatus === 'succeeded') {
      sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
      router.push('/main');
    }
  }, [jobStatus, router]);

  useEffect(() => {
    if (jobStatus === 'failed' && jobDetail) {
      sessionStorage.removeItem(RESYNC_JOB_ID_KEY);
      const message = getPortalLinkErrorMessage(jobDetail);
      setErrorMessage(message);
    }
  }, [jobStatus, jobDetail]);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!jobId) {
    throw new Error('연동 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
  }

  return <LoadingScreen />;
}
