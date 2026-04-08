'use client';

import { useEffect, useState } from 'react';
import { FixedButton, TextField } from '@/components/ui';
import { usePortalLinkMutation, usePortalLinkJobPolling, usePortalLinkSummary } from '@/features/portal-link/hooks';
import { getPortalLinkErrorMessage } from '@/features/portal-link/utils/errorMapping';
import { useFunnelContext } from '../../../contexts';
import styles from './PortalLoginForm.module.scss';

interface PortalLoginFormProps {
  onSuccess: (studentCode: string) => void;
  onError?: (error: Error) => void;
}

export function PortalLoginForm({ onSuccess, onError }: PortalLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { setStudentInfo, jobId, setJobId } = useFunnelContext();
  const linkMutation = usePortalLinkMutation();

  const { data: jobStatusData } = usePortalLinkJobPolling(jobId);
  const jobStatus = jobStatusData?.data?.status;
  const jobDetail = jobStatusData?.data;

  const { data: summaryData } = usePortalLinkSummary(jobId, jobStatus);

  // job 상태 변화 로깅
  useEffect(() => {
    if (jobId) {
      console.log('[PortalLoginForm] job 상태 변화', { jobId, jobStatus, jobDetail });
    }
  }, [jobId, jobStatus, jobDetail]);

  // job 실패 처리
  useEffect(() => {
    if (jobStatus === 'failed' && jobDetail) {
      console.log('[PortalLoginForm] job 실패', { jobDetail });
      const message = getPortalLinkErrorMessage(jobDetail);
      setErrorMessage(message);
      setJobId(null as unknown as string);
    }
  }, [jobStatus, jobDetail, setJobId]);

  // job 성공 → summary 처리
  useEffect(() => {
    if (summaryData?.data?.studentInfo) {
      console.log('[PortalLoginForm] 연동 성공! studentInfo:', summaryData.data.studentInfo);
      setStudentInfo(summaryData.data.studentInfo);
      onSuccess(summaryData.data.studentInfo.studentCode ?? username);
    }
  }, [summaryData, setStudentInfo, onSuccess, username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    console.log('[PortalLoginForm] 폼 제출', { username });

    try {
      const result = await linkMutation.mutateAsync({ username, password });
      const newJobId = result.data?.job_id;
      console.log('[PortalLoginForm] 연동 요청 결과', { newJobId, result });

      if (newJobId) {
        setJobId(newJobId);
      } else {
        setErrorMessage('연동 요청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      console.error('[PortalLoginForm] 연동 요청 에러', err);
      const message = err?.message ?? '알 수 없는 오류가 발생했어요\n잠시후 다시 시도해주세요';
      setErrorMessage(message);
      onError?.(err as Error);
    }
  };

  const isPolling = !!jobId && jobStatus !== 'failed';
  const isLoading = linkMutation.isPending || isPolling;

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <TextField
        name="username"
        placeholder="학번을 입력해주세요"
        value={username}
        onChange={e => setUsername(e.target.value)}
        error={Boolean(errorMessage)}
        disabled={isLoading}
      />
      <TextField
        name="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={Boolean(errorMessage)}
        disabled={isLoading}
      />
      {errorMessage && (
        <div className={styles.errorMessage}>
          {errorMessage.split('\n').map((line: string, i: number) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
      <FixedButton type="submit" disabled={!username || !password || isLoading} isLoading={isLoading}>
        {isPolling ? '학교 정보를 불러오는 중...' : '학교 연동하기'}
      </FixedButton>
    </form>
  );
}
