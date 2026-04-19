'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { FixedButton, TextField } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkMutation } from '@/features/portal-link/hooks';
import { RESYNC_JOB_ID_KEY } from '@/constants/portal-link';
import { generateIdempotencyKey } from '@/shared/utils/idempotency';
import { FunnelHeadline, SchoolCard } from '../../(funnel)/components';
import styles from './page.module.scss';

export default function PortalLogin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const router = useInternalRouter();
  const linkMutation = usePortalLinkMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setErrorMessage('');

      const idempotencyKey = generateIdempotencyKey();
      const result = await linkMutation.mutateAsync({ username, password, idempotencyKey });
      const jobId = result.data?.job_id;

      if (jobId) {
        sessionStorage.setItem(RESYNC_JOB_ID_KEY, jobId);
        router.push(`${ROUTES.RESYNC.SCRAPING}`);
      } else {
        setErrorMessage('연동 요청에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (err: any) {
      captureException(err);
      setErrorMessage(err.message ?? '알 수 없는 오류가 발생했어요\n잠시후 다시 시도해주세요');
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

        <FixedButton type="submit" disabled={!username || !password || linkMutation.isPending} isLoading={linkMutation.isPending}>
          학업 이력 동기화하기
        </FixedButton>
      </form>
    </div>
  );
}
