'use client';

import { useEffect, useState } from 'react';
import type { RoutePath } from '@/hooks/useInternalRouter';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { ErrorModal } from '@/components/ui';
import { useMutationErrorHandler } from '@/shared/hooks/useMutationErrorHandler';
import { useLectureEvaluationStatusQuery } from '../../apis/queries/useLectureEvaluationStatusQuery';
import { useSkipLectureEvaluationMutation } from '../../apis/queries/useSkipLectureEvaluationMutation';
import { useSubmitLectureEvaluationsMutation } from '../../apis/queries/useSubmitLectureEvaluationsMutation';
import type { SubmitLectureEvaluationsRequest } from '../../types';
import { LectureEvaluationForm } from '../LectureEvaluationForm/LectureEvaluationForm';
import { LectureEvaluationIntro } from '../LectureEvaluationIntro/LectureEvaluationIntro';
import styles from './LectureEvaluationScreen.module.scss';

interface LectureEvaluationScreenProps {
  exitRoute: RoutePath;
}

export function LectureEvaluationScreen({ exitRoute }: LectureEvaluationScreenProps) {
  const router = useInternalRouter();
  const { data } = useLectureEvaluationStatusQuery();
  const submitMutation = useSubmitLectureEvaluationsMutation();
  const skipMutation = useSkipLectureEvaluationMutation();
  const [isIntroOpen, setIsIntroOpen] = useState(true);
  const { handleMutationError, modalState, closeModal, retry, goToInquiry } = useMutationErrorHandler();
  const isPending = data.evaluationStatus === 'PENDING';
  // PENDING 이어도 평가할 성적이 없으면 머무를 화면이 없으므로 종료 경로로 보낸다.
  // (이 케이스를 redirect 조건에서 빼면 영구 공백 화면에 갇힌다.)
  const shouldExit = !isPending || data.grades.length === 0;

  useEffect(() => {
    if (shouldExit) {
      router.replace(exitRoute);
    }
  }, [exitRoute, shouldExit, router]);

  if (shouldExit) {
    return null;
  }

  const handleSubmit = async (request: SubmitLectureEvaluationsRequest) => {
    try {
      await submitMutation.mutateAsync(request);
      router.replace(exitRoute);
    } catch (error) {
      handleMutationError(error, () => handleSubmit(request));
    }
  };

  const handleSkip = async () => {
    try {
      await skipMutation.mutateAsync({ year: data.year, semester: data.semester });
      router.replace(exitRoute);
    } catch (error) {
      handleMutationError(error, () => handleSkip());
    }
  };

  const isSubmitting = submitMutation.isPending || skipMutation.isPending;
  const firstGrade = data.grades[0];

  return (
    <main className={styles.screen}>
      {isIntroOpen ? (
        <LectureEvaluationIntro
          grade={firstGrade}
          onOpen={() => setIsIntroOpen(false)}
          onSkip={handleSkip}
          isSkipping={skipMutation.isPending}
        />
      ) : (
        <LectureEvaluationForm
          year={data.year}
          semester={data.semester}
          grades={data.grades}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onSkip={handleSkip}
        />
      )}

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
    </main>
  );
}