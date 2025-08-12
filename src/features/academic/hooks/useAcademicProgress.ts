import { useMemo } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { ROUTES } from '@/constants/routes';
import { getAcademicPeriod, getLatestSemester } from '../utils/semesterUtils';
import { getCourseAreaDisplayName, isAreaCompleted } from '../utils/courseAreaUtils';
import type { SemesterGrade, AreaProgress } from '../types/graduation';

/**
 * 학기 진도 관련 비즈니스 로직을 처리하는 훅
 */
export function useSemesterProgress(semesterGrades: SemesterGrade[]) {
  const router = useInternalRouter();

  const academicPeriod = useMemo(() => {
    return getAcademicPeriod(semesterGrades);
  }, [semesterGrades]);

  const navigateToLatestSemester = useMemo(() => {
    return () => {
      const latestSemester = getLatestSemester(semesterGrades);
      if (latestSemester) {
        router.push(ROUTES.ACADEMIC_DETAIL, {
          query: {
            year: latestSemester.year,
            semester: latestSemester.semester,
          },
        });
      }
    };
  }, [semesterGrades, router]);

  return {
    academicPeriod,
    navigateToLatestSemester,
    hasData: semesterGrades.length > 0,
  };
}

/**
 * 영역별 진도 관련 비즈니스 로직을 처리하는 훅
 */
export function useAreaProgress(areaProgress: AreaProgress[]) {
  const progressWithDisplayInfo = useMemo(() => {
    return areaProgress.map(area => ({
      ...area,
      displayName: getCourseAreaDisplayName(area.areaType),
      isCompleted: isAreaCompleted(area),
    }));
  }, [areaProgress]);

  return {
    progressWithDisplayInfo,
  };
}