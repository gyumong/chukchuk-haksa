import { describe, expect, it } from 'vitest';
import { referenceRankSchema } from '../../types/referenceRank';
import type { ReferenceRank } from '../../types/referenceRank';
import { getLatestRegularSemester, getReferenceRankValue, isReferenceRankSemester } from '../referenceRankView';

function makeRank(overrides: Partial<ReferenceRank> = {}): ReferenceRank {
  return {
    cohort: { year: 2026, semester: 10, majorCode: 'CS', majorName: '컴퓨터SW전공', gradeLevel: 3 },
    status: 'EXACT',
    rank: 32,
    rankFrom: null,
    rankTo: null,
    participantCount: 50,
    tiedCount: 1,
    reasons: [],
    dataAsOf: '2026-11-02T16:00:00.123456Z',
    calculatedAt: '2026-11-03T00:00:00Z',
    rulesVersion: 'suwon-reference-v1',
    ...overrides,
  };
}

describe('getReferenceRankValue', () => {
  it('확정·공동 석차는 순위/비교 인원으로 표시한다', () => {
    expect(getReferenceRankValue(makeRank())).toBe('32/50');
    expect(getReferenceRankValue(makeRank({ status: 'TIED', tiedCount: 3 }))).toBe('32/50');
  });

  it('미확정은 확정 순위처럼 보이지 않게 범위로 표시한다', () => {
    const data = makeRank({ status: 'UNRESOLVED', rank: null, rankFrom: 5, rankTo: 7, tiedCount: null });

    expect(getReferenceRankValue(data)).toBe('5~7위');
  });

  it.each([
    ['UNAVAILABLE', makeRank({ status: 'UNAVAILABLE', rank: null, participantCount: null, tiedCount: null })],
    ['INSUFFICIENT_PEERS', makeRank({ status: 'INSUFFICIENT_PEERS', rank: null, participantCount: 1, tiedCount: null })],
    ['순위가 빠진 EXACT', makeRank({ rank: null })],
  ])('%s 는 순위를 지어내지 않고 - 로 표시한다', (_, data) => {
    expect(getReferenceRankValue(data)).toBe('-');
  });
});

describe('getLatestRegularSemester', () => {
  it('계절학기를 건너뛰고 가장 최근 정규학기를 고른다', () => {
    const terms = [
      { year: 2026, semester: 15 },
      { year: 2025, semester: 20 },
      { year: 2026, semester: 10 },
      { year: 2025, semester: 25 },
    ];

    expect(getLatestRegularSemester(terms)).toEqual({ year: 2026, semester: 10 });
  });

  it('정규학기가 없으면 null 이다', () => {
    expect(getLatestRegularSemester([{ year: 2026, semester: 15 }])).toBeNull();
  });
});

describe('isReferenceRankSemester', () => {
  it('정규학기만 허용한다', () => {
    expect([10, 15, 20, 25].map(isReferenceRankSemester)).toEqual([true, false, true, false]);
  });
});

describe('referenceRankSchema', () => {
  it('생략된 nullable 필드를 null 로 정규화한다', () => {
    const parsed = referenceRankSchema.parse({
      status: 'UNAVAILABLE',
      reasons: ['TERM_SNAPSHOT_MISSING'],
      calculatedAt: '2026-11-03T00:00:00Z',
      rulesVersion: 'suwon-reference-v1',
    });

    expect(parsed.cohort).toBeNull();
    expect(parsed.rank).toBeNull();
  });

  it('알 수 없는 상태는 거부한다', () => {
    expect(() => referenceRankSchema.parse(makeRank({ status: 'OTHER' as ReferenceRank['status'] }))).toThrow();
  });
});
