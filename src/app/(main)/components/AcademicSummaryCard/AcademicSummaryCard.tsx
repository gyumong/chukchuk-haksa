import { useAcademicSummaryQuery } from '@/features/dashboard/apis/queries/useAcademicSummaryQuery';
import styles from './AcademicSummaryCard.module.scss';

interface Props {
  earnedCredits: number; // 취득학점
  gpa: number; // 평점 평균
  percentile?: number; // 백분위
  classRank?: number; // 석차
  totalStudents?: number; // 전체 학생 수
}

// 삭제 예정

export default function AcademicSummaryCard({ earnedCredits, gpa, percentile, classRank, totalStudents }: Props) {
  const { data } = useAcademicSummaryQuery();

  console.log(data);

  return (
    <div className={styles.container}>
      <div className={styles.statItem}>
        <span className={styles.label}>취득학점</span>
        <span className={styles.value}>{data.totalEarnedCredits}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.statItem}>
        <span className={styles.label}>평점평균</span>
        <span className={styles.value}>{gpa.toFixed(2)}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.statItem}>
        <span className={styles.label}>{classRank ? '석차' : '백분위'}</span>
        <span className={styles.value}>{classRank ? `${classRank}/${totalStudents}` : percentile}</span>
      </div>
    </div>
  );
}
