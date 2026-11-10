'use client';

import { useState } from 'react';
import { useAcademicRecordQuery } from '@/features/academic/apis/queries/useAcademicRecordQuery';
import { ReferenceRankInfoDialog } from '@/features/academic/components/detail/ReferenceRankInfoDialog/ReferenceRankInfoDialog';
import ReferenceRankValue from '@/features/academic/components/detail/ReferenceRankValue/ReferenceRankValue';
import SectionCourses from '@/features/academic/components/detail/SectionCourses';
import SemesterSlider from '@/features/academic/components/detail/SemesterSlider';
import AcademicSummaryCard from '@/features/academic/components/shared/AcademicSummaryCard/AcademicSummaryCard';
import { useAcademicDetail } from '@/features/academic/hooks/useAcademicDetail';
import AsyncBoundary from '@/shared/components/AsyncBoundary';
import styles from './page.module.scss';

function LoadingFallback() {
  return <div className={styles.container}>로딩 중...</div>;
}

function AcademicRecordContent({ year, semester }: { year: number; semester: number }) {
  const { data: academicRecord } = useAcademicRecordQuery(year, semester);
  const [isRankInfoOpen, setIsRankInfoOpen] = useState(false);

  return (
    <>
      <AcademicSummaryCard
        earnedCredits={academicRecord.semesterGrade.earnedCredits}
        gpa={academicRecord.semesterGrade.semesterGpa}
        rank={{
          value: <ReferenceRankValue year={year} semester={semester} />,
          onInfoClick: () => setIsRankInfoOpen(true),
        }}
      />
      <ReferenceRankInfoDialog isOpen={isRankInfoOpen} onClose={() => setIsRankInfoOpen(false)} />

      <div className={styles.spacingLarge}></div>
      <SectionCourses title="전공" courses={academicRecord.courses.major} />

      <div className={styles.spacingLarge}></div>
      <SectionCourses title="교양" courses={academicRecord.courses.liberal} />

      {academicRecord.courses.etc.length > 0 && (
        <>
          <div className={styles.spacingLarge}></div>
          <SectionCourses title="기타" courses={academicRecord.courses.etc} />
        </>
      )}
    </>
  );
}

function ValidSemesterContent({ year, semester }: { year: number; semester: number }) {
  return (
    <div className={styles.container}>
      <div className={styles.spacingTop}></div>
      <AsyncBoundary>
        <SemesterSlider currentYear={year} currentSemester={semester} />
      </AsyncBoundary>
      <div className={styles.spacingMedium}></div>

      <AsyncBoundary>
        <AcademicRecordContent year={year} semester={semester} />
      </AsyncBoundary>
    </div>
  );
}

function AcademicDetailContent() {
  const { currentSemester, hasError, isRedirecting } = useAcademicDetail();

  // 리다이렉트 진행 중이거나 유효하지 않은 학기 정보
  if (isRedirecting || !currentSemester.isValid) {
    return <div></div>;
  }

  // 에러 상태
  if (hasError) {
    return <div className={styles.container}>유효하지 않은 학기 정보입니다.</div>;
  }

  return <ValidSemesterContent year={currentSemester.year} semester={currentSemester.semester} />;
}

export default function AcademicDetailPage() {
  return (
    <AsyncBoundary suspenseFallback={<LoadingFallback />} fullPage>
      <AcademicDetailContent />
    </AsyncBoundary>
  );
}
