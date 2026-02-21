import { describe, it, expect } from 'vitest';
import { sortAreasByCompletion, isAreaCompleted, getCourseAreaDisplayName } from '../courseAreaUtils';
import type { AreaProgress } from '../../types/graduation';

function makeArea(overrides: Partial<AreaProgress> = {}): AreaProgress {
  return {
    areaType: '전핵',
    earnedCredits: 0,
    requiredCredits: 18,
    completedElectiveCourses: 0,
    requiredElectiveCourses: 0,
    totalElectiveCourses: 0,
    courses: [],
    ...overrides,
  };
}

describe('sortAreasByCompletion', () => {
  it('완료된 영역이 미완료 영역보다 앞에 온다', () => {
    const areas = [
      { isCompleted: false, label: 'A' },
      { isCompleted: true, label: 'B' },
      { isCompleted: false, label: 'C' },
    ];
    const result = sortAreasByCompletion(areas);
    expect(result[0].label).toBe('B');
  });

  it('원본 배열을 변경하지 않는다', () => {
    const areas = [{ isCompleted: false }, { isCompleted: true }];
    const copy = [...areas];
    sortAreasByCompletion(areas);
    expect(areas).toEqual(copy);
  });

  it('모두 완료된 경우 순서가 유지된다', () => {
    const areas = [
      { isCompleted: true, label: 'A' },
      { isCompleted: true, label: 'B' },
    ];
    const result = sortAreasByCompletion(areas);
    expect(result.map(a => a.label)).toEqual(['A', 'B']);
  });
});

describe('isAreaCompleted', () => {
  it('학점과 선택과목 모두 충족하면 완료', () => {
    const area = makeArea({ earnedCredits: 18, requiredCredits: 18, completedElectiveCourses: 2, requiredElectiveCourses: 2 });
    expect(isAreaCompleted(area)).toBe(true);
  });

  it('학점 미달이면 미완료', () => {
    const area = makeArea({ earnedCredits: 10, requiredCredits: 18, completedElectiveCourses: 2, requiredElectiveCourses: 2 });
    expect(isAreaCompleted(area)).toBe(false);
  });

  it('선택과목 미달이면 미완료', () => {
    const area = makeArea({ earnedCredits: 18, requiredCredits: 18, completedElectiveCourses: 1, requiredElectiveCourses: 2 });
    expect(isAreaCompleted(area)).toBe(false);
  });

  it('requiredElectiveCourses가 0이면 학점만 충족해도 완료', () => {
    const area = makeArea({ earnedCredits: 18, requiredCredits: 18, completedElectiveCourses: 0, requiredElectiveCourses: 0 });
    expect(isAreaCompleted(area)).toBe(true);
  });
});

describe('getCourseAreaDisplayName', () => {
  it('전핵 → 전공핵심', () => {
    expect(getCourseAreaDisplayName('전핵')).toBe('전공핵심');
  });

  it('복선 → 복수전공선택', () => {
    expect(getCourseAreaDisplayName('복선')).toBe('복수전공선택');
  });

  it('중핵 → 중핵교양', () => {
    expect(getCourseAreaDisplayName('중핵')).toBe('중핵교양');
  });

  it('일선 → 일반선택', () => {
    expect(getCourseAreaDisplayName('일선')).toBe('일반선택');
  });
});
