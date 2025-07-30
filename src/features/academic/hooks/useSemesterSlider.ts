import { useCallback } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { ROUTES } from '@/constants/routes';
import { useSemesterListQuery } from '../apis/queries/useSemesterListQuery';
import { getSemesterLabel } from '../utils/semesterUtils';

/**
 * 학기 슬라이더의 비즈니스 로직을 처리하는 훅
 */
export function useSemesterSlider(currentYear: number, currentSemester: number) {
  const router = useInternalRouter();
  const { data: semesters } = useSemesterListQuery();

  // 학기 선택 핸들러
  const handleSemesterClick = useCallback((year: number, semester: number) => {
    router.replace(ROUTES.ACADEMIC_DETAIL, { query: { year, semester } });
  }, [router]);

  // 현재 학기인지 확인하는 함수
  const isCurrentSemester = useCallback((year: number, semester: number) => {
    return year === currentYear && semester === currentSemester;
  }, [currentYear, currentSemester]);

  // 학기별 표시 데이터 생성
  const semesterItems = semesters?.map(semester => ({
    ...semester,
    label: `${semester.year}년 ${getSemesterLabel(semester.semester)}`,
    isActive: isCurrentSemester(semester.year, semester.semester),
  })) || [];

  return {
    semesterItems,
    handleSemesterClick,
  };
}