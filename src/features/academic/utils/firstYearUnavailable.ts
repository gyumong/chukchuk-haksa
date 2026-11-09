import { ApiError } from '@/shared/api/errors';

/** 현재 1학년이고 소속·입학 연도에 적용할 졸업요건이 아직 없음 (GET /api/graduation/progress). */
export const FIRST_YEAR_REQUIREMENTS_UNAVAILABLE = 'G03';

/** 현재 1학년이고 저장된 학기 성적이 아직 없음 (GET /api/semester, GET /api/semester/grades). */
export const FIRST_YEAR_GRADES_UNAVAILABLE = 'A09';

export function isApiErrorWithCode(error: unknown, appCode: string): error is ApiError {
  return error instanceof ApiError && error.appCode === appCode;
}
