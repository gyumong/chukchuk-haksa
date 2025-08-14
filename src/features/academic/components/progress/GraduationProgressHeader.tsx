'use client';

import { useSemesterGradesQuery } from '../../apis/queries/useSemesterGradesQuery';
import { useSemesterProgress } from '../../hooks/useAcademicProgress';
import SemesterGradeCard from '../shared/SemesterGradeCard/SemesterGradeCard';
import styles from './GraduationProgressHeader.module.scss';

export default function GraduationProgressHeader() {
  const { data: semesterGrades } = useSemesterGradesQuery();
  const { academicPeriod, navigateToLatestSemester, hasData } = useSemesterProgress(semesterGrades);

  if (!hasData) {
    return <div>학기 데이터가 없습니다.</div>;
  }

  return (
    <>
      <SemesterGradeCard
        startSemester={academicPeriod.start}
        endSemester={academicPeriod.end}
        onClick={navigateToLatestSemester}
      />
      <div className={styles.spacingBottom}></div>
    </>
  );
}
