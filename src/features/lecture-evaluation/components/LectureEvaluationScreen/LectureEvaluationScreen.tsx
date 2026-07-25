'use client';

import { useEffect, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import type { RoutePath } from '@/hooks/useInternalRouter';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { ApiError } from '@/shared/api/errors';
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
  const [errorMessage, setErrorMessage] = useState('');
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

  const handleError = (error: unknown) => {
    captureException(error);
    setErrorMessage(
      error instanceof ApiError ? error.userMessage : '요청 처리 중 오류가 발생했어요. 다시 시도해주세요.'
    );
  };

  const handleSubmit = async (request: SubmitLectureEvaluationsRequest) => {
    try {
      setErrorMessage('');
      await submitMutation.mutateAsync(request);
      router.replace(exitRoute);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSkip = async () => {
    try {
      setErrorMessage('');
      await skipMutation.mutateAsync({ year: data.year, semester: data.semester });
      router.replace(exitRoute);
    } catch (error) {
      handleError(error);
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

      {errorMessage && (
        <p className={styles.error} role="alert" aria-live="assertive">
          {errorMessage}
        </p>
      )}
    </main>
  );
}
