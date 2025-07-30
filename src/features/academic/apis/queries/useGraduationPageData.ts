import { useGraduationProgressQuery } from './useGraduationProgressQuery';
import { useAcademicSummaryQuery } from './useAcademicSummaryQuery';
import { useSemesterGradesQuery } from './useSemesterGradesQuery';
import type { GraduationPageData } from '../../types/graduation';

/**
 * 졸업 진도 페이지에서 필요한 모든 데이터를 제공하는 composite hook
 * 
 * 개별 hook들을 조합하여 통합된 인터페이스 제공:
 * - 통합된 로딩/에러 상태
 * - 개별 쿼리 상태 접근 (디버깅/세밀한 제어용)
 * - 타입 안전한 데이터 제공
 */
export function useGraduationPageData() {
  const graduationQuery = useGraduationProgressQuery();
  const academicQuery = useAcademicSummaryQuery();
  const semesterQuery = useSemesterGradesQuery();

  // 통합 데이터 객체
  const data: GraduationPageData = {
    graduationProgress: graduationQuery.data,
    academicSummary: academicQuery.data,
    semesterGrades: semesterQuery.data,
  };

  return {
    // 통합 인터페이스
    data,
    isLoading: graduationQuery.isLoading || academicQuery.isLoading || semesterQuery.isLoading,
    error: graduationQuery.error || academicQuery.error || semesterQuery.error,
    
    // 개별 쿼리 접근 (필요시)
    queries: {
      graduation: graduationQuery,
      academic: academicQuery,
      semester: semesterQuery,
    },
  };
}