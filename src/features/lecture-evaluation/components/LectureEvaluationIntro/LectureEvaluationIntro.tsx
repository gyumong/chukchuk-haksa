'use client';

import Image from 'next/image';
import { LECTURE_EVALUATION_TAG_OPTIONS } from '../../constants/tags';
import styles from './LectureEvaluationIntro.module.scss';

interface LectureEvaluationIntroProps {
  grade: {
    courseName: string;
    professor: string;
    areaType: string;
    credits: number;
  };
  onOpen: () => void;
  onSkip: () => void;
  isSkipping?: boolean;
}

export function LectureEvaluationIntro({ grade, onOpen, onSkip, isSkipping = false }: LectureEvaluationIntroProps) {
  return (
    <section className={styles.intro}>
      <button
        type="button"
        className={styles.introCard}
        aria-label={`${grade.courseName} 성적 카드 열기`}
        onClick={onOpen}
      >
        <span className={styles.introHeader}>
          <span className={styles.eyeSlot}>
            <Image
              className={styles.eyes}
              src="/images/lecture-evaluation/eyes.png"
              alt=""
              width={104}
              height={70}
              priority
            />
          </span>
          <strong className={styles.courseName}>{grade.courseName}</strong>
          <span className={styles.courseMeta}>
            {grade.professor} 교수 <span aria-hidden="true">I</span> {grade.areaType} <span aria-hidden="true">I</span>{' '}
            {grade.credits}학점
          </span>
        </span>

        <span className={styles.introBody}>
          <span className={styles.fieldLabel}>강의평가</span>
          <span className={styles.disabledTagGrid}>
            {LECTURE_EVALUATION_TAG_OPTIONS.map(option => (
              <span key={option.value} className={styles.disabledTag}>
                {option.label}
              </span>
            ))}
          </span>

          <span className={styles.tapGuide}>
            <Image
              className={styles.pointer}
              src="/images/lecture-evaluation/tap.png"
              alt=""
              width={76}
              height={76}
              priority
            />
            <span className={styles.tapLabel}>터치해서 성적 확인하기</span>
          </span>

          <span className={styles.reviewLabel}>수강후기(선택)</span>
          <span className={styles.disabledReview}>
            수강하면서 느낀 점을 자유롭게 남겨주세요.
            <br />
            (ex. 출석 중요, 팀플 2인 1조 등)
          </span>
        </span>

        <span className={styles.introActions}>
          <span className={styles.disabledNext}>다음</span>
        </span>
      </button>

      <div className={styles.skipArea}>
        <button type="button" className={styles.skipButton} disabled={isSkipping} onClick={onSkip}>
          강의평가 건너뛰기
        </button>
        <p>*수강랭킹은 강의평가 참여 유저만 제공됩니다.</p>
      </div>
    </section>
  );
}
