'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import type { CourseDetail } from '@/types/api/academic';
import AcademicSummaryCard from '../components/AcademicSummaryCard/AcademicSummaryCard';
import GradeCard from './components/GradeCard/GradeCard';
import SemesterSlider from './components/SemesterSlider';
import styles from './page.module.scss';

interface AcademicDetailProps {
  semesterGrades: {
    year: number;
    semester: string;
    earnedCredits: number;
    attemptedCredits: number;
    semesterGpa: number;
    classRank?: number;
    totalStudents?: number;
  };
  courses: {
    major: CourseDetail[];
    liberal: CourseDetail[];
  };
}

export default function AcademicDetailPage() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AcademicDetailContent />
    </Suspense>
  );
}

function AcademicDetailContent() {
  const searchParams = useSearchParams();
  const year = parseInt(searchParams.get('year') || '0');
  const semester = parseInt(searchParams.get('semester') || '0');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AcademicDetailProps | null>(null);

  useEffect(() => {
    const fetchAcademicDetail = async () => {
      if (!year || !semester) {
        setError('년도와 학기 정보가 필요합니다.');
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/get-academic/${year}/${semester}`);
        if (!response.ok) {
          throw new Error('성적 정보를 불러오는데 실패했습니다.');
        }

        const result = await response.json();
        setData({
          semesterGrades: result.semesterGrades[0], // 해당 학기 성적
          courses: result.courses, // 전공/교양 과목 목록
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAcademicDetail();
  }, [year, semester]);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <>
      <div className={styles.gap8}></div>
      <SemesterSlider currentYear={year} currentSemester={semester} />
      <div className={styles.gap20}></div>
      {/* 학기 성적 요약 */}
      <AcademicSummaryCard
        earnedCredits={data.semesterGrades.earnedCredits}
        gpa={data.semesterGrades.semesterGpa}
        classRank={data.semesterGrades.classRank}
        totalStudents={data.semesterGrades.totalStudents}
      />
      <div className={styles.gap24}></div>
      {/* 전공 과목 목록 */}
      <div className={styles.majorText}>전공 ({data.courses.major.length})</div>
      <div className={styles.gap12}></div>
      <div className={styles.cardsContainer}>
        {data.courses.major.map(course => (
          <GradeCard
            key={course.courseCode}
            courseCode={course.courseCode}
            courseType={course.areaType}
            credits={course.credits}
            professor={course.professor}
            courseName={course.courseName}
            grade={course.grade}
            originalScore={course.originalScore ?? 0}
          />
        ))}
      </div>
      {/* 교양 과목 목록 */}
      <div className={styles.gap24}></div>
      <div className={styles.majorText}>교양 ({data.courses.liberal.length})</div>
      <div className={styles.gap12}></div>
      <div className={styles.cardsContainer}>
        {data.courses.liberal.map(course => (
          <GradeCard
            key={course.courseCode}
            courseCode={course.courseCode}
            courseType={course.areaType}
            credits={course.credits}
            professor={course.professor}
            courseName={course.courseName}
            grade={course.grade}
            originalScore={course.originalScore ?? 0}
          />
        ))}
      </div>
    </>
  );
}
