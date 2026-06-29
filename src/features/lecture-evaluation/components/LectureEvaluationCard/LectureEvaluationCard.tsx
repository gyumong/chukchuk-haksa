import React, { memo } from 'react';
import type { LectureEvaluationGrade } from '../../types';
import type { LectureEvaluationDraftStore } from '../../utils/draftStore';
import { getGradeBand } from '../../utils/grade';
import styles from './LectureEvaluationCard.module.scss';
import { LectureEvaluationReview } from './LectureEvaluationReview';
import { LectureEvaluationTags } from './LectureEvaluationTags';

interface LectureEvaluationCardProps {
  year: number;
  semesterLabel: string;
  grade: LectureEvaluationGrade;
  draftIndex: number;
  draftStore: LectureEvaluationDraftStore;
}

function LectureEvaluationCardComponent({
  year,
  semesterLabel,
  grade,
  draftIndex,
  draftStore,
}: LectureEvaluationCardProps) {
  const gradeBand = getGradeBand(grade.grade);

  return (
    <article className={styles.card} data-grade-band={gradeBand}>
      <header className={styles.header}>
        <div className={styles.headerBackground} />
        <div className={styles.headerContent}>
          <p className={styles.semester}>
            {year}년 {semesterLabel} 강의평가
          </p>
          <div className={styles.gradeRow}>
            <strong className={styles.grade}>{grade.grade}</strong>
            {grade.score !== null && (
              <span className={styles.score} data-testid="lecture-evaluation-score">
                {grade.score}
              </span>
            )}
          </div>
          <h1 className={styles.courseName}>{grade.courseName}</h1>
          <p className={styles.courseMeta}>
            {grade.professor} 교수 <span aria-hidden="true">I</span> {grade.areaType} <span aria-hidden="true">I</span>{' '}
            {grade.credits}학점
          </p>
        </div>
      </header>

      <div className={styles.content}>
        <LectureEvaluationTags index={draftIndex} store={draftStore} />
        <LectureEvaluationReview
          index={draftIndex}
          inputId={`lecture-review-${grade.courseId}-${grade.professorId}`}
          store={draftStore}
        />
      </div>
    </article>
  );
}

export const LectureEvaluationCard = memo(LectureEvaluationCardComponent);
