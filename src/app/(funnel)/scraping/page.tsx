'use client';

import { useEffect, useState } from 'react';
import { setUser } from '@sentry/nextjs';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkJobPolling, usePortalLinkSummary } from '@/features/portal-link/hooks';
import { getPortalLinkErrorMessage } from '@/features/portal-link/utils/errorMapping';
import { useFunnelContext } from '../contexts';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';

export default function ScrapingPage() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useInternalRouter();
  const { jobId, setStudentInfo } = useFunnelContext();

  const { data: jobStatusData } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.data?.status;
  const jobDetail = jobStatusData?.data;

  const { data: summaryData } = usePortalLinkSummary(jobId, jobStatus);

  useEffect(() => {
    if (summaryData?.data?.studentInfo) {
      setStudentInfo(summaryData.data.studentInfo);
      setUser({ username: summaryData.data.studentInfo.studentCode ?? '' });
      router.push(`${ROUTES.FUNNEL.AGREEMENT}`);
    }
  }, [summaryData, setStudentInfo, router]);

  useEffect(() => {
    if (jobStatus === 'failed' && jobDetail) {
      const message = getPortalLinkErrorMessage(jobDetail);
      setErrorMessage(message);
    }
  }, [jobStatus, jobDetail]);

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (!jobId) {
    throw new Error('연동 정보를 찾을 수 없습니다. 다시 시도해주세요.');
  }

  return <LoadingScreen />;
}
