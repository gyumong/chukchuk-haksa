import { describe, expect, it } from 'vitest';
import { getGradeBand } from '../grade';

describe('getGradeBand', () => {
  it.each([
    ['A+', 'a'],
    ['A0', 'a'],
    ['B+', 'b'],
    ['C0', 'c'],
    ['D', 'd'],
    ['P', 'p'],
    ['F', 'fallback'],
    ['S', 'fallback'],
  ])('%s 성적을 %s 색상 그룹으로 분류한다', (grade, expected) => {
    expect(getGradeBand(grade)).toBe(expected);
  });
});
