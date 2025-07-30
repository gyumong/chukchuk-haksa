'use client';

import { useAcademicSummaryQuery } from '../../apis/queries/useAcademicSummaryQuery';
import AcademicSummaryCard from '../shared/AcademicSummaryCard/AcademicSummaryCard';
import styles from './AcademicSummarySection.module.scss';

export default function AcademicSummarySection() {
  const { data: academicSummary } = useAcademicSummaryQuery();
  return (
    <>
      <div className={styles.title}>전체 수강내역</div>
      <div className={styles.spacing}></div>
      <AcademicSummaryCard
        earnedCredits={academicSummary.totalEarnedCredits}
        gpa={academicSummary.cumulativeGpa}
        percentile={academicSummary.percentile}
      />
      <div className={styles.spacing}></div>
    </>
  );
}
