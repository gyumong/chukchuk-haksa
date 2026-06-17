import { describe, it, expect } from 'vitest';
import { getSemesterShortLabel } from '../semester';

describe('getSemesterShortLabel', () => {
  it('정규학기 코드(10/20)를 1/2 로 변환한다', () => {
    expect(getSemesterShortLabel(10)).toBe('1');
    expect(getSemesterShortLabel(20)).toBe('2');
  });

  it('계절학기 코드(15/25)를 여름/겨울 로 변환한다', () => {
    expect(getSemesterShortLabel(15)).toBe('여름');
    expect(getSemesterShortLabel(25)).toBe('겨울');
  });

  it('알 수 없는 코드는 throw 없이 원본 숫자를 문자열로 반환한다', () => {
    expect(getSemesterShortLabel(99)).toBe('99');
    expect(getSemesterShortLabel(0)).toBe('0');
  });
});
