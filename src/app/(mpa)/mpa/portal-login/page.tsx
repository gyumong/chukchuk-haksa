'use client';

// /mpa/resync/login 과 동일 폼. portal-link 별도 entry point. 프로토콜: docs/mpa-school-link-handoff.md
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { ConfirmDialog, FixedButton, TextField } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { usePortalLinkMutation } from '@/features/portal-link/hooks';
import { popRetry, stashAttemptUsername } from '@/features/portal-link/utils/credentialRetry';
import { getMessageByErrorCode } from '@/features/portal-link/utils/errorMapping';
import { PORTAL_LOGIN_JOB_ID_KEY } from '@/constants/portal-link';
import { EVENTS, track, useTrackView } from '@/lib/analytics';
import { ApiError } from '@/shared/api/errors';
import { generateIdempotencyKey } from '@/shared/utils/idempotency';
import { isInWebView, postBridgeMessage } from '@/lib/webview';
import { FunnelHeadline, SchoolCard } from '@/app/(funnel)/components';
import sharedStyles from '@/app/resync/login/page.module.scss';
import styles from './page.module.scss';

// 신입생·편입생 등 즉시 학교 인증이 불가한 사용자가 "확인" 으로 학교 연동 건너뛰기 선택 시
// 네이티브에 송출. 네이티브가 webview dismiss + 시간표 만들기 화면으로 전환.
// 프로토콜: docs/mpa-school-link-handoff.md M3.
const BRIDGE_SKIP_PORTAL_LINK = 'skip:portal-link';

export default function MpaPortalLogin() {
  useTrackView(EVENTS.UNIV_SYNC_LOGIN_VIEW);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isSkipDialogOpen, setIsSkipDialogOpen] = useState<boolean>(false);
  const router = useInternalRouter();
  const linkMutation = usePortalLinkMutation();

  const handleSkipConfirm = () => {
    setIsSkipDialogOpen(false);
    // 네이티브에 학교 연동 건너뛰기 의사 전달. webview 환경 아니면 noop —
    // (mpa) 라우트는 webview 전용이라 사실상 도달 안 함, 안전망 차원.
    if (isInWebView()) {
      const posted = postBridgeMessage(BRIDGE_SKIP_PORTAL_LINK);
      if (!posted) {
        // bridge 송출 실패 시 사용자가 다이얼로그 닫힌 채 무반응 상태에 갇히지 않도록 인라인 에러 노출.
        setErrorMessage('요청 처리에 실패했어요. 다시 시도해주세요.');
      }
    }
  };

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
    track(EVENTS.UNIV_SYNC_BTN_TAP);

    try {
      setErrorMessage('');

      const idempotencyKey = generateIdempotencyKey();
      stashAttemptUsername(username);
      const result = await linkMutation.mutateAsync({ username, password, idempotencyKey });
      const jobId = result?.job_id;

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
    <div className={sharedStyles.container}>
      <FunnelHeadline
        title="재학 중인 학교<br/>계정을 연동해주세요"
        description="척척학사에서 수집하는 개인 정보는<br/>학교 연동 후 즉시 폐기됩니다."
      />

      <form onSubmit={handleSubmit} className={sharedStyles.formContainer}>
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
          <div className={sharedStyles.errorMessage} role="alert" aria-live="polite">
            {errorMessage.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        <button type="button" className={styles.skipLink} onClick={() => setIsSkipDialogOpen(true)}>
          즉시 학교 연동이 불가하신가요?
          <br />
          (ex. 신입생, 편입생)
        </button>

        <FixedButton
          type="submit"
          disabled={!username || !password || linkMutation.isPending}
          isLoading={linkMutation.isPending}
        >
          학업 이력 동기화하기
        </FixedButton>
      </form>

      <ConfirmDialog
        isOpen={isSkipDialogOpen}
        message={`학교 연동없이 이용시\n'시간표 만들기'만 이용 가능합니다.`}
        onConfirm={handleSkipConfirm}
        onClose={() => setIsSkipDialogOpen(false)}
      />
    </div>
  );
}
