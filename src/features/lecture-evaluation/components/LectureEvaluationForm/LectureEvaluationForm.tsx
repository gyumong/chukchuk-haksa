'use client';

import { Button } from '@/components/ui';
import { getSemesterLabel } from '@/features/academic/utils/semesterUtils';
import { useLectureEvaluationForm } from '../../hooks/useLectureEvaluationForm';
import type { LectureEvaluationGrade, SubmitLectureEvaluationsRequest } from '../../types';
import { LectureEvaluationCard } from '../LectureEvaluationCard/LectureEvaluationCard';
import styles from './LectureEvaluationForm.module.scss';

interface LectureEvaluationFormProps {
  year: number;
  semester: number;
  grades: LectureEvaluationGrade[];
  isSubmitting?: boolean;
  onSubmit: (request: SubmitLectureEvaluationsRequest) => void;
  onSkip?: () => void;
}

export function LectureEvaluationForm({
  year,
  semester,
  grades,
  isSubmitting = false,
  onSubmit,
  onSkip,
}: LectureEvaluationFormProps) {
  const form = useLectureEvaluationForm({ year, semester, grades });

  if (!form.currentGrade) {
    return null;
  }

  const handlePrimaryAction = () => {
    if (form.isLast) {
      void onSubmit(form.getRequest());
      return;
    }

    form.goNext();
  };

  return (
    <section className={styles.container}>
      <div className={styles.cardWrapper}>
        <LectureEvaluationCard
          key={`${form.currentGrade.courseId}-${form.currentGrade.professorId}`}
          year={year}
          semesterLabel={getSemesterLabel(semester)}
          grade={form.currentGrade}
          draftIndex={form.currentIndex}
          draftStore={form.draftStore}
        />

        <div className={styles.actions}>
          <Button
            type="button"
            size="md"
            width="full"
            disabled={isSubmitting}
            isLoading={isSubmitting}
            onClick={handlePrimaryAction}
          >
            {form.isLast ? '제출하기' : '다음'}
          </Button>
        </div>
      </div>

      {onSkip && (
        <div className={styles.skipArea}>
          <button type="button" className={styles.skipButton} onClick={onSkip}>
            강의평가 건너뛰기
          </button>
          <p>*수강랭킹은 강의평가 참여 유저만 제공됩니다.</p>
        </div>
      )}
    </section>
  );
}
