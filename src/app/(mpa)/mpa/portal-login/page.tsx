'use client';

// /mpa/resync/login 과 동일 폼. portal-link 별도 entry point. 프로토콜: docs/mpa-school-link-handoff.md
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { FixedButton, TextField } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkMutation } from '@/features/portal-link/hooks';
import { popRetry, stashAttemptUsername } from '@/features/portal-link/utils/credentialRetry';
import { getMessageByErrorCode } from '@/features/portal-link/utils/errorMapping';
import { PORTAL_LOGIN_JOB_ID_KEY } from '@/constants/portal-link';
import { ApiError } from '@/shared/api/errors';
import { generateIdempotencyKey } from '@/shared/utils/idempotency';
import { FunnelHeadline, SchoolCard } from '@/app/(funnel)/components';
import styles from '@/app/resync/login/page.module.scss';

export default function MpaPortalLogin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useInternalRouter();
  const linkMutation = usePortalLinkMutation();

  useEffect(() => {
    const { username: retriedUsername, code } = popRetry();
    if (retriedUsername) {
      setUsername(retriedUsername);
    }
    if (code) {
      setErrorMessage(getMessageByErrorCode(code));
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setErrorMessage('');

      const idempotencyKey = generateIdempotencyKey();
      stashAttemptUsername(username);
      const result = await linkMutation.mutateAsync({ username, password, idempotencyKey });
      const jobId = result.data?.job_id;

      if (jobId) {
        sessionStorage.setItem(PORTAL_LOGIN_JOB_ID_KEY, jobId);
        router.push(ROUTES.MPA.PORTAL_LOGIN_SCRAPING);
      } else {
        setErrorMessage('연동 요청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: unknown) {
      captureException(err);
      const message =
        err instanceof ApiError
          ? err.userMessage
          : err instanceof Error && err.message
            ? err.message
            : '알 수 없는 오류가 발생했어요\n잠시후 다시 시도해주세요';
      setErrorMessage(message);
    }
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
    </div>
  );
}
