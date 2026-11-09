import type { ReferenceRank } from '../types/referenceRank';

export const REFERENCE_RANK_EMPTY = '-';

/** 참고 석차는 정규학기(10·20)만 지원한다. */
export function isReferenceRankSemester(semester: number) {
  return semester === 10 || semester === 20;
}

/** 학업 상세 성적 카드 석차 칸의 표시값. 순위를 확정할 수 없으면 범위나 '-' 로 내린다. */
export function getReferenceRankValue({ status, rank, rankFrom, rankTo, participantCount }: ReferenceRank) {
  if ((status === 'EXACT' || status === 'TIED') && rank !== null && participantCount !== null) {
    return `${rank}/${participantCount}`;
  }

  if (status === 'UNRESOLVED' && rankFrom !== null && rankTo !== null && participantCount !== null) {
    return `${rankFrom}~${rankTo}/${participantCount}`;
  }

  return REFERENCE_RANK_EMPTY;
}
