import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { ROUTES } from '@/constants/routes';
import { useSemesterListQuery } from '../apis/queries/useSemesterListQuery';
import { 
  parseAndValidateSemesterParams
} from '../utils/semesterUtils';

/**
 * Academic Detail 페이지의 URL 파라미터 처리와 리다이렉트 로직을 담당하는 훅
 */
export function useAcademicDetail() {
  const searchParams = useSearchParams();
  const router = useInternalRouter();
  
  // URL 파라미터 파싱
  const { year, semester, isValid: hasValidParams } = useMemo(() => {
    return parseAndValidateSemesterParams(
      searchParams.get('year'),
      searchParams.get('semester')
    );
  }, [searchParams]);

  // 사용 가능한 학기 리스트
  const { data: semesters } = useSemesterListQuery();
  
  // 학기 유효성 검증
  const isValidSemesterData = useMemo(() => {
    if (!year || !semester || !semesters) {
      return false;
    }
    return semesters.some(s => s.year === year && s.semester === semester);
  }, [year, semester, semesters]);

  // 리다이렉트 로직
  useEffect(() => {
    if (!hasValidParams && semesters && semesters.length > 0) {
      // 가장 최근 학기로 리다이렉트 (배열의 마지막 요소)
      const latestSemester = semesters[semesters.length - 1];
      if (latestSemester) {
        router.replace(ROUTES.ACADEMIC_DETAIL, {
          query: {
            year: latestSemester.year,
            semester: latestSemester.semester,
          },
        });
      }
    }
  }, [hasValidParams, semesters, router]);

  return {
    // 현재 선택된 학기 정보
    currentSemester: {
      year,
      semester,
      isValid: hasValidParams && isValidSemesterData,
    },
    // 에러 상태
    hasError: hasValidParams && Boolean(semesters) && !isValidSemesterData,
    // 리다이렉트 진행 중 여부
    isRedirecting: !hasValidParams && Boolean(semesters),
  };
}