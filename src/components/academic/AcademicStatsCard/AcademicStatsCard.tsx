import type { ReactNode } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './AcademicStatsCard.module.scss';

const AcademicStatsCard = ({
  earnedCredits,
  gpa,
  rankValue,
  onRankInfoClick,
}: {
  earnedCredits: number;
  gpa: number;
  rankValue: ReactNode;
  onRankInfoClick: () => void;
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.statItem}>
        <span className={styles.label}>취득학점</span>
        <span className={styles.value}>{earnedCredits}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.statItem}>
        <span className={styles.label}>평점 평균</span>
        <span className={styles.value}>{gpa.toFixed(2)}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.statItem}>
        <span className={styles.labelRow}>
          <span className={styles.label}>석차</span>
          <button type="button" className={styles.infoButton} aria-label="석차 기준 안내 보기" onClick={onRankInfoClick}>
            <Icon name="info" size={20} />
          </button>
        </span>
        <span className={styles.value}>{rankValue}</span>
      </div>
    </div>
  );
};

export default AcademicStatsCard;
