import type { ReferenceRank } from '../types/referenceRank';

export const REFERENCE_RANK_EMPTY = '-';

/** 참고 석차는 정규학기(10·20)만 지원한다. */
export function isReferenceRankSemester(semester: number) {
  return semester === 10 || semester === 20;
}

/** 학업 상세 성적 카드 석차 칸의 표시값. 순위를 확정할 수 없으면 범위나 '-' 로 내린다. */
export function getReferenceRankValue({ status, rank, rankFrom, rankTo, participantCount }: ReferenceRank) {
  if (status === 'EXACT' && rank !== null && participantCount !== null) {
    return `${rank}/${participantCount}`;
  }

  // 동점자는 공동 순위로 표시한다. rank 는 경쟁 순위(1위 → 공동 2위 → 공동 2위 → 4위)로 내려온다.
  if (status === 'TIED' && rank !== null && participantCount !== null) {
    return `공동 ${rank}/${participantCount}`;
  }

  if (status === 'UNRESOLVED' && rankFrom !== null && rankTo !== null && participantCount !== null) {
    return `${rankFrom}~${rankTo}/${participantCount}`;
  }

  return REFERENCE_RANK_EMPTY;
}
