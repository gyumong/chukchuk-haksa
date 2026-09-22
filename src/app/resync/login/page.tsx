'use client';

import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { ErrorModal, FixedButton, TextField } from '@/components/ui';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import { ROUTES } from '@/constants/routes';
import { usePortalLinkMutation } from '@/features/portal-link/hooks';
import { popRetry, stashAttemptUsername } from '@/features/portal-link/utils/credentialRetry';
import { getMessageByErrorCode } from '@/features/portal-link/utils/errorMapping';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { EVENTS, track, useTrackView } from '@/lib/analytics';
import { useMutationErrorHandler } from '@/shared/hooks/useMutationErrorHandler';
import { generateIdempotencyKey } from '@/shared/utils/idempotency';
import { FunnelHeadline, SchoolCard } from '../../(funnel)/components';
import styles from './page.module.scss';

export default function PortalLogin() {
  useTrackView(EVENTS.UNIV_RESYNC_LOGIN_VIEW);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useInternalRouter();
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
      const jobId = result?.job_id;

      if (jobId) {
        sessionStorage.setItem(RESYNC_JOB_ID_KEY, jobId);
        router.push(`${ROUTES.RESYNC.SCRAPING}`);
      } else {
        handleMutationError(new Error('연동 요청에 실패했습니다. 다시 시도해주세요.'), submitPortalLink);
      }
    } catch (err: unknown) {
      handleMutationError(err, submitPortalLink);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    track(EVENTS.UNIV_RESYNC_BTN_TAP);
    setErrorMessage('');
    void submitPortalLink();
  };

  return (
    <div className={styles.container}>
      <FunnelHeadline
        title="재학 중인 학교<br/>계정을 연동해주세요"
        description="척척학사에서 수집하는 개인 정보는<br/>학교 연동 후 즉시 폐기됩니다."
      />

      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <SchoolCard schoolName="수원대학교" />

        <TextField
          placeholder="학번을 입력해주세요"
          value={username}
          onChange={e => setUsername(e.target.value)}
          error={Boolean(errorMessage)}
        />

        <TextField
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={Boolean(errorMessage)}
        />

        {errorMessage && (
          <div className={styles.errorMessage}>
            {errorMessage.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        <FixedButton
          type="submit"
          disabled={!username || !password || linkMutation.isPending}
          isLoading={linkMutation.isPending}
        >
          학업 이력 동기화하기
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
    </div>
  );
}