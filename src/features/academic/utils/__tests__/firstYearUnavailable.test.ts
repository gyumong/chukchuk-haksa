import { describe, expect, it } from 'vitest';
import { ApiError } from '@/shared/api/errors';
import {
  FIRST_YEAR_GRADES_UNAVAILABLE,
  FIRST_YEAR_REQUIREMENTS_UNAVAILABLE,
  isApiErrorWithCode,
} from '../firstYearUnavailable';

describe('isApiErrorWithCode', () => {
  it('같은 appCode 의 ApiError 만 true 다', () => {
    const g03 = new ApiError('msg', 'NOT_FOUND', 404, FIRST_YEAR_REQUIREMENTS_UNAVAILABLE);

    expect(isApiErrorWithCode(g03, FIRST_YEAR_REQUIREMENTS_UNAVAILABLE)).toBe(true);
    expect(isApiErrorWithCode(g03, FIRST_YEAR_GRADES_UNAVAILABLE)).toBe(false);
  });

  it('기존 코드(G02)나 ApiError 가 아닌 에러는 안내 대상이 아니다', () => {
    expect(isApiErrorWithCode(new ApiError('msg', '', 404, 'G02'), FIRST_YEAR_REQUIREMENTS_UNAVAILABLE)).toBe(false);
    expect(isApiErrorWithCode(new Error('G03'), FIRST_YEAR_REQUIREMENTS_UNAVAILABLE)).toBe(false);
    expect(isApiErrorWithCode(null, FIRST_YEAR_GRADES_UNAVAILABLE)).toBe(false);
  });
});
