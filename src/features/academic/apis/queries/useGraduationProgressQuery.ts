import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchGraduationProgressResponse } from '../service';

// 졸업 진도 응답은 동일 queryKey 로 한 번만 받아오고(React Query 캐시 공유),
// 용도별로 select 해서 사용한다.

/** 영역별 이수현황 배열. 기존 소비부(AreaProgressSection) 호환 유지. */
export function useGraduationProgressQuery() {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.graduationProgress(),
    queryFn: fetchGraduationProgressResponse,
    select: response => response.graduationProgress,
  });
}

/** 외국어 졸업 인증 충족 여부 / 포털 새로고침 필요 여부. fulfilled 는 동기화 전이면 null. */
export function useLanguageCertStatusQuery() {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.graduationProgress(),
    queryFn: fetchGraduationProgressResponse,
    select: response => ({
      fulfilled: response.languageCertFulfilled ?? null,
      needsRefresh: response.languageCertNeedsRefresh,
    }),
  });
}
