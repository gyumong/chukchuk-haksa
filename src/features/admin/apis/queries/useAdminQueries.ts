import { useQuery } from '@tanstack/react-query';
import type { SearchCourseOfferingsParams } from '@/shared/api/data-contracts';
import { adminQueryKeys } from '../queryKey';
import { fetchGraduationCourses, fetchTestOptions, searchCourseOfferings, searchDepartments } from '../service';

// 어드민 조회 훅.
//
// 레포 기본은 useSuspenseQuery 지만, 여기선 의도적으로 useQuery 를 쓴다 — 어드민은 13종 API 를
// 한 화면에 늘어놓은 dev 도구라, 한 엔드포인트가 죽었다고 페이지 전체가 ErrorBoundary 로
// 날아가면 나머지 12종을 못 쓴다. 섹션별로 에러를 인라인 표시하고 나머지는 계속 동작시킨다.
// (검색형 조회는 keyword 입력 전 실행하면 안 되므로 enabled 게이팅도 필요하다.)

/** 학과·졸업요건 영역 선택지. 페이지 진입 시 1회. */
export function useTestOptionsQuery() {
  return useQuery({
    queryKey: adminQueryKeys.testOptions(),
    queryFn: fetchTestOptions,
    staleTime: 1000 * 60 * 30,
  });
}

/** 학과 검색. keyword 가 비면 요청하지 않는다. */
export function useDepartmentSearchQuery(keyword: string) {
  const trimmed = keyword.trim();
  return useQuery({
    queryKey: adminQueryKeys.departments(trimmed),
    queryFn: () => searchDepartments(trimmed),
    enabled: trimmed.length > 0,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 개설강의 후보 검색. 사용자가 [검색]을 누른 뒤에만(enabled) 실행한다.
 *
 * 이 엔드포인트만 재시도를 켠 이유(전역 기본값은 retry:false): dev 백엔드가 결과 집합이 커지면
 * 간헐적으로 500 INTERNAL_ERROR 를 낸다. 같은 요청이 한 번은 500, 다음엔 200(411건)으로 오는 것을
 * 확인했다. 결과가 작으면(≤50건) 항상 성공하고, keyword 없이 year/semester 만 보내면(=결과 거대)
 * 항상 500 이다 — 즉 재시도로 흡수되는 건 경계 구간의 흔들림이고, 넓은 검색은 좁혀야 한다
 * (docs/admin-page-design.md §7-6, BE 보고 대상).
 */
export function useCourseOfferingsQuery(params: SearchCourseOfferingsParams, enabled: boolean) {
  return useQuery({
    queryKey: adminQueryKeys.courseOfferings(params),
    queryFn: () => searchCourseOfferings(params),
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: attemptIndex => 500 * 2 ** attemptIndex,
  });
}

/** 현재 계정의 수강 현황(졸업요건 진척 평탄화). 조회 전용 — 삭제용 id 는 이 응답에 없다. */
export function useGraduationCoursesQuery(enabled: boolean) {
  return useQuery({
    queryKey: adminQueryKeys.graduationCourses(),
    queryFn: fetchGraduationCourses,
    enabled,
    staleTime: 0,
  });
}
