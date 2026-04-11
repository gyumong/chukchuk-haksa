'use client';

import { useState } from 'react';
import { FixedButton, TextField } from '@/components/ui';
import { usePortalLinkMutation } from '@/features/portal-link/hooks';
import { generateIdempotencyKey } from '@/shared/api/utils/idempotency';
import { useFunnelContext } from '../../../contexts';
import styles from './PortalLoginForm.module.scss';

interface PortalLoginFormProps {
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

export function PortalLoginForm({ onSuccess, onError }: PortalLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { setJobId } = useFunnelContext();
  const linkMutation = usePortalLinkMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const idempotencyKey = generateIdempotencyKey();

    try {
      const result = await linkMutation.mutateAsync({ username, password, idempotencyKey });
      const newJobId = result.data?.job_id;

      if (newJobId) {
        setJobId(newJobId);
        onSuccess();
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

  const isLoading = linkMutation.isPending;

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
        학교 연동하기
      </FixedButton>
    </form>
  );
}
