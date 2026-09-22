'use client';

import { useEffect, useState } from 'react';
import { ErrorModal, FixedButton, TextField } from '@/components/ui';
import { usePortalLinkMutation } from '@/features/portal-link/hooks';
import { popRetry, stashAttemptUsername } from '@/features/portal-link/utils/credentialRetry';
import { getMessageByErrorCode } from '@/features/portal-link/utils/errorMapping';
import { EVENTS, track } from '@/lib/analytics';
import { useMutationErrorHandler } from '@/shared/hooks/useMutationErrorHandler';
import { generateIdempotencyKey } from '@/shared/utils/idempotency';
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
  const { handleMutationError, modalState, closeModal, retry, goToInquiry } = useMutationErrorHandler();

  useEffect(() => {
    const { username: retriedUsername, code } = popRetry();
    if (retriedUsername) {
      setUsername(retriedUsername);
    }
    if (code) {
      setErrorMessage(getMessageByErrorCode(code));
    }
  }, []);

  const submitPortalLink = async () => {
    const idempotencyKey = generateIdempotencyKey();
    stashAttemptUsername(username);

    try {
      const result = await linkMutation.mutateAsync({ username, password, idempotencyKey });
      const newJobId = result?.job_id;

      if (newJobId) {
        setJobId(newJobId);
        onSuccess();
      } else {
        const fallbackError = new Error('연동 요청에 실패했습니다. 다시 시도해주세요.');
        onError?.(fallbackError);
        handleMutationError(fallbackError, submitPortalLink);
      }
    } catch (err: unknown) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
      handleMutationError(err, submitPortalLink);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    track(EVENTS.UNIV_SYNC_BTN_TAP);
    setErrorMessage('');
    void submitPortalLink();
  };

  const isLoading = linkMutation.isPending;

  return (
    <>
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
      <ErrorModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        code={modalState.code}
        onRetry={modalState.showRetry ? retry : undefined}
        onInquiry={() => {
          closeModal();
          goToInquiry();
        }}
        onClose={closeModal}
      />
    </>
  );
}