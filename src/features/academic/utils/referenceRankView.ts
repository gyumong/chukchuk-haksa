import type { ReferenceRank } from '../types/referenceRank';

export const REFERENCE_RANK_EMPTY = '-';

interface SemesterTerm {
  year: number;
  semester: number;
}

export function isReferenceRankSemester(semester: number) {
  return semester === 10 || semester === 20;
}

/** 계절학기를 제외한 가장 최근 정규학기. 참고 석차는 정규학기만 지원한다. */
export function getLatestRegularSemester<T extends SemesterTerm>(semesters: T[]): T | null {
  const regular = semesters.filter(term => isReferenceRankSemester(term.semester));
  const sorted = [...regular].sort((a, b) => a.year - b.year || a.semester - b.semester);

  return sorted[sorted.length - 1] ?? null;
}

/** 홈 성적 카드 석차 칸의 표시값. 순위를 확정할 수 없으면 범위나 '-' 로 내린다. */
export function getReferenceRankValue({ status, rank, rankFrom, rankTo, participantCount }: ReferenceRank) {
  if ((status === 'EXACT' || status === 'TIED') && rank !== null && participantCount !== null) {
    return `${rank}/${participantCount}`;
  }

  if (status === 'UNRESOLVED' && rankFrom !== null && rankTo !== null && participantCount !== null) {
    return `${rankFrom}~${rankTo}/${participantCount}`;
  }

  return REFERENCE_RANK_EMPTY;
}
