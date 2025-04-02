'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from '@/hooks/useInternalRouter';
import type { CourseDetail } from '@/types/api/academic';
import AcademicSummaryCard from '../components/AcademicSummaryCard/AcademicSummaryCard';
import SectionCourses from './components/SectionCourses/SectionCourses';
import SemesterSlider from './components/SemesterSlider';

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
    <Suspense fallback={<div></div>}>
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
    return <div></div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!data) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <>
      <div className="gap-8"></div>
      <SemesterSlider currentYear={year} currentSemester={semester} />
      <div className="gap-20"></div>
      {/* 학기 성적 요약 */}
      <AcademicSummaryCard
        earnedCredits={data.semesterGrades.earnedCredits}
        gpa={data.semesterGrades.semesterGpa}
        classRank={data.semesterGrades.classRank}
        totalStudents={data.semesterGrades.totalStudents}
      />
      <div className="gap-24"></div>
      {/* 전공 과목 목록 */}
      <SectionCourses title="전공" courses={data.courses.major} />
      {/* 교양 과목 목록 */}
      <div className="gap-24"></div>
      <SectionCourses title="교양" courses={data.courses.liberal} />
    </>
  );
}
