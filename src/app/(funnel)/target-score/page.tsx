'use client';

import { useState } from 'react';
import { ErrorModal, FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useSetTargetGpaMutation } from '@/features/student/apis/queries/useSetTargetGpaMutation';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { EVENTS, track } from '@/lib/analytics';
import { useMutationErrorHandler } from '@/shared/hooks/useMutationErrorHandler';
import { FunnelHeadline, ScoreInput } from '../components';
import styles from './page.module.scss';

export default function TargetScorePage() {
  const [score, setScore] = useState('3.5');
  const router = useInternalRouter();
  const mutation = useSetTargetGpaMutation();
  const { handleMutationError, modalState, closeModal, retry, goToInquiry } = useMutationErrorHandler();

  const handleSubmit = async () => {
    const gpa = parseFloat(score);
    track(EVENTS.UNIV_SYNC_SET_GPA_BTN_TAP, { gpa });
    try {
      await mutation.mutateAsync(gpa);
      router.push(`${ROUTES.FUNNEL.FOREIGN_LANGUAGE_CERT}`);
    } catch (error) {
      handleMutationError(error, handleSubmit);
    }
  };
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <div className={styles.container}>
        <FunnelHeadline
          title="목표로 하시는<br/>졸업 학점을 입력해 주세요"
          description="목표 학점으로 졸업할 수 있게<br/>척척학사에서 도와드릴게요"
          highlightText="졸업 학점"
        />
        <div className="gap-100" />
        <ScoreInput value={score} onChange={setScore} />
        <FixedButton onClick={handleSubmit} isLoading={mutation.isPending}>
          다음
        </FixedButton>
      </div>
      <ErrorModal
        isOpen={modalState.isOpen}
        message={modalState.message}
        code={modalState.code}
        onRetry={modalState.showRetry ? retry : undefined}
        onInquiry={() => { closeModal(); goToInquiry(); }}
        onClose={closeModal}
      />
    </ProtectedRoute>
  );
}