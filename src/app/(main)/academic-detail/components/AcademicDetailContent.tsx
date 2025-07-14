import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { academicRecordApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { CourseDetailDto } from '@/shared/api/data-contracts';
import AcademicSummaryCard from '../../components/AcademicSummaryCard/AcademicSummaryCard';
import SectionCourses from './SectionCourses/SectionCourses';
import SemesterSlider from './SemesterSlider';

interface AcademicDetailProps {
  semesterGrades: {
    year: number;
    semester: number;
    earnedCredits: number;
    attemptedCredits: number;
    semesterGpa: number;
    classRank?: number | null;
    totalStudents?: number | null;
    percentile: number;
  };
  courses: {
    major: CourseDetailDto[];
    liberal: CourseDetailDto[];
  };
}

export default function AcademicDetailContent() {
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
        const data = await ApiResponseHandler.handleAsyncResponse(
          academicRecordApi.getAcademicRecord({ year, semester })
        );

        setData({
          semesterGrades: data.semesterGrade,
          courses: data.courses,
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
        classRank={data.semesterGrades.classRank || undefined}
        totalStudents={data.semesterGrades.totalStudents || undefined}
      />
      <div className="gap-24"></div>
      {/* 전공 과목 목록 */}
      <SectionCourses title="전공" courses={data.courses.major as any} />
      {/* 교양 과목 목록 */}
      <div className="gap-24"></div>
      <SectionCourses title="교양" courses={data.courses.liberal as any} />
    </>
  );
}
