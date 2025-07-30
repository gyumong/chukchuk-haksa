import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { ROUTES } from '@/constants/routes';
import { useAcademicRecordQuery } from '@/features/academic/apis/queries/useAcademicRecordQuery';
import { useSemesterListQuery } from '@/features/academic/apis/queries/useSemesterListQuery';
import AcademicSummaryCard from '@/app/(main)/components/AcademicSummaryCard/AcademicSummaryCard';
import SectionCourses from './SectionCourses';
import SemesterSlider from './SemesterSlider';

export default function AcademicDetailContent() {
  const searchParams = useSearchParams();
  const router = useInternalRouter();
  const year = parseInt(searchParams.get('year') || '0');
  const semester = parseInt(searchParams.get('semester') || '0');
  
  // 사용 가능한 학기 리스트 가져오기
  const { data: semesters } = useSemesterListQuery();
  
  // year와 semester가 유효할 때만 데이터 쿼리 실행
  const isValidSemester = Boolean(year && semester && semesters && semesters.some(s => s.year === year && s.semester === semester));
  const { data, isLoading } = useAcademicRecordQuery(year, semester, isValidSemester);
  
  // year와 semester가 없으면 가장 최근 학기로 리다이렉트
  useEffect(() => {
    if ((!year || !semester) && semesters && semesters.length > 0) {
      // 가장 최근 학기 (배열의 마지막 요소)
      const latestSemester = semesters[semesters.length - 1];
      router.replace(ROUTES.ACADEMIC_DETAIL, {
        query: {
          year: latestSemester.year,
          semester: latestSemester.semester,
        },
      });
      return;
    }
  }, [year, semester, semesters, router]);
  
  // 데이터가 아직 로딩 중이거나 리다이렉트 중이면 로딩 표시
  if (!year || !semester) {
    return <div></div>;
  }
  
  // 유효하지 않은 year/semester 체크
  if (semesters && !semesters.some(s => s.year === year && s.semester === semester)) {
    return <div>유효하지 않은 학기 정보입니다.</div>;
  }

  // 데이터가 아직 로드되지 않았거나 로딩 중이면 로딩 표시
  if (isLoading || !data) {
    return <div></div>;
  }

  return (
    <>
      <div style={{ marginBottom: '8px' }}></div>
      <SemesterSlider currentYear={year} currentSemester={semester} />
      <div style={{ marginBottom: '20px' }}></div>
      {/* 학기 성적 요약 */}
      <AcademicSummaryCard
        earnedCredits={data.semesterGrade.earnedCredits}
        gpa={data.semesterGrade.semesterGpa}
        classRank={data.semesterGrade.classRank || undefined}
        totalStudents={data.semesterGrade.totalStudents || undefined}
      />
      <div style={{ marginBottom: '24px' }}></div>
      {/* 전공 과목 목록 */}
      <SectionCourses
        title="전공"
        courses={data.courses.major}
      />
      {/* 교양 과목 목록 */}
      <div style={{ marginBottom: '24px' }}></div>
      <SectionCourses
        title="교양"
        courses={data.courses.liberal}
      />
    </>
  );
}
