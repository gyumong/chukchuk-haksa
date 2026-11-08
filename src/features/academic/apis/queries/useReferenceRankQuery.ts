import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchReferenceRank } from '../service';

/** 정규학기(10·20)만 호출한다. 계절학기는 400 이므로 isReferenceRankSemester 로 먼저 거른다. */
export function useReferenceRankQuery(year: number, semester: number) {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.referenceRank(year, semester),
    queryFn: () => fetchReferenceRank(year, semester),
  });
}
