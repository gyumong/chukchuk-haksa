import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './AcademicSummaryCard.module.scss';

interface AcademicSummaryCardProps {
  earnedCredits: number; // 취득학점
  gpa: number; // 평점 평균
  percentile?: number; // 백분위 (rank 가 없을 때 표시)
  /** 석차 칸. 주어지면 백분위 대신 석차와 기준 안내 버튼을 표시한다. */
  rank?: {
    value: ReactNode;
    onInfoClick: () => void;
  };
}

export default function AcademicSummaryCard({ earnedCredits, gpa, percentile, rank }: AcademicSummaryCardProps) {
  return (
    <div className={styles.container}>
      <div className={styles.statItem}>
        <span className={styles.label}>취득학점</span>
        <span className={styles.value}>{earnedCredits}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.statItem}>
        <span className={styles.label}>평점평균</span>
        <span className={styles.value}>{gpa.toFixed(2)}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.statItem}>
        {rank ? (
          <>
            <span className={styles.labelRow}>
              <span className={styles.label}>석차</span>
              <button
                type="button"
                className={styles.infoButton}
                aria-label="석차 기준 안내 보기"
                onClick={rank.onInfoClick}
              >
                <Icon name="info-small" size={16} />
              </button>
            </span>
            <span className={styles.value}>{rank.value}</span>
          </>
        ) : (
          <>
            <span className={styles.label}>백분위</span>
            <span className={styles.value}>{percentile}</span>
          </>
        )}
      </div>
    </div>
  );
}
