import { describe, it, expect } from 'vitest';
import { isDualMajorArea, isMainMajorArea, separateProgressByMajor, calculateDualMajorCredits } from '../dualMajorUtils';
import type { AreaProgress } from '../../types/graduation';

function makeArea(areaType: AreaProgress['areaType'], earnedCredits = 0, requiredCredits = 18): AreaProgress {
  return {
    areaType,
    earnedCredits,
    requiredCredits,
    completedElectiveCourses: 0,
    requiredElectiveCourses: 0,
    totalElectiveCourses: 0,
    courses: [],
  };
}

describe('isDualMajorArea', () => {
  it('복선은 복수전공 영역이다', () => {
    expect(isDualMajorArea('복선')).toBe(true);
  });

  it('복핵은 복수전공 영역이다', () => {
    expect(isDualMajorArea('복핵')).toBe(true);
  });

  it('복교는 복수전공 영역이다', () => {
    expect(isDualMajorArea('복교')).toBe(true);
  });

  it('전핵은 복수전공 영역이 아니다', () => {
    expect(isDualMajorArea('전핵')).toBe(false);
  });

  it('중핵은 복수전공 영역이 아니다', () => {
    expect(isDualMajorArea('중핵')).toBe(false);
  });
});

describe('isMainMajorArea', () => {
  it('전선은 주전공 영역이다', () => {
    expect(isMainMajorArea('전선')).toBe(true);
  });

  it('복선은 주전공 영역이 아니다', () => {
    expect(isMainMajorArea('복선')).toBe(false);
  });
});

describe('separateProgressByMajor', () => {
  it('복수전공 영역이 있으면 hasDualMajor가 true', () => {
    const areas = [makeArea('전핵'), makeArea('복선'), makeArea('복핵')];
    const { hasDualMajor, mainMajorProgress, dualMajorProgress } = separateProgressByMajor(areas);
    expect(hasDualMajor).toBe(true);
    expect(mainMajorProgress).toHaveLength(1);
    expect(dualMajorProgress).toHaveLength(2);
  });

  it('복수전공 영역이 없으면 hasDualMajor가 false', () => {
    const areas = [makeArea('전핵'), makeArea('전선')];
    const { hasDualMajor, dualMajorProgress } = separateProgressByMajor(areas);
    expect(hasDualMajor).toBe(false);
    expect(dualMajorProgress).toHaveLength(0);
  });

  it('빈 배열이면 hasDualMajor가 false', () => {
    const { hasDualMajor } = separateProgressByMajor([]);
    expect(hasDualMajor).toBe(false);
  });
});

describe('calculateDualMajorCredits', () => {
  it('복수전공 영역 학점을 합산한다', () => {
    const areas = [
      makeArea('복선', 10, 18),
      makeArea('복핵', 15, 21),
      makeArea('복교', 5, 9),
    ];
    const { earnedCredits, requiredCredits } = calculateDualMajorCredits(areas);
    expect(earnedCredits).toBe(30);
    expect(requiredCredits).toBe(48);
  });

  it('빈 배열이면 0을 반환한다', () => {
    const { earnedCredits, requiredCredits } = calculateDualMajorCredits([]);
    expect(earnedCredits).toBe(0);
    expect(requiredCredits).toBe(0);
  });
});
