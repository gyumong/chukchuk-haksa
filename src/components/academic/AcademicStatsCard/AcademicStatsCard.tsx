import styles from './AcademicStatsCard.module.scss';

const PERCENTILE_EMPTY = '-';

const AcademicStatsCard = ({
  earnedCredits,
  gpa,
  percentile,
}: {
  earnedCredits: number;
  gpa: number;
  percentile?: number | null;
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
        <span className={styles.label}>백분위</span>
        <span className={styles.value}>{percentile ?? PERCENTILE_EMPTY}</span>
      </div>
    </div>
  );
};

export default AcademicStatsCard;
