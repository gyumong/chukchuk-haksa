import styles from './AcademicStatsCard.module.scss';

const AcademicStatsCard = ({
  earnedCredits,
  gpa,
  rankInfo,
}: {
  earnedCredits: number;
  gpa: number;
  rankInfo: { type: 'percentile'; value: number } | { type: 'classRank'; rank: number; total: number };
}) => {
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
        <span className={styles.label}>{rankInfo.type === 'classRank' ? '석차' : '백분위'}</span>
        <span className={styles.value}>
          {rankInfo.type === 'classRank' ? `${rankInfo.rank}/${rankInfo.total}` : rankInfo.value}
        </span>
      </div>
    </div>
  );
};

export default AcademicStatsCard;
