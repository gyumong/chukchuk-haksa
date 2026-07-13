import type { GraduationArea, LectureEvaluationTestState } from './types';

/**
 * 졸업요건 영역 13종. 런타임 선택지는 GET /api/admin/test-options 의 graduationAreas 를
 * 우선 쓰고, 조회 실패 시 이 목록으로 폴백한다 (어드민 도구가 한 API 장애로 멈추지 않게).
 */
export const GRADUATION_AREAS: readonly GraduationArea[] = [
  '중핵',
  '기교',
  '선교',
  '소교',
  '전교',
  '전취',
  '전핵',
  '전선',
  '일선',
  '복선',
  '복핵',
  '복교',
  '기타',
] as const;

/**
 * 학기는 1/2 가 아니라 **학기 코드**다 (src/lib/utils/semester.ts, e2e/fixtures/admin.ts 와 동일 계약).
 * 여기를 1/2 로 보내면 백엔드가 조용히 다른 학기로 저장하거나 매칭에 실패한다.
 */
export const SEMESTER_OPTIONS: ReadonlyArray<{ code: number; label: string }> = [
  { code: 10, label: '1학기' },
  { code: 15, label: '여름학기' },
  { code: 20, label: '2학기' },
  { code: 25, label: '겨울학기' },
] as const;

/** 성적 선택지. 백엔드는 문자열을 그대로 받으므로 표기가 곧 계약이다. */
export const GRADE_OPTIONS: readonly string[] = [
  'A+',
  'A0',
  'B+',
  'B0',
  'C+',
  'C0',
  'D+',
  'D0',
  'F',
  'P',
  'NP',
] as const;

/** 강의평가 상태 세팅 버튼 5종. */
export const LECTURE_EVALUATION_STATES: ReadonlyArray<{
  state: LectureEvaluationTestState;
  label: string;
  description: string;
}> = [
  { state: 'skipped', label: 'SKIPPED', description: '강의평가 건너뛰기' },
  { state: 'pending', label: 'PENDING', description: '강의평가 대기' },
  { state: 'not-released', label: 'NOT_RELEASED', description: '성적 미공개' },
  { state: 'empty-semester', label: 'EMPTY_SEMESTER', description: '평가/수강/학기 row 삭제' },
  { state: 'completed', label: 'COMPLETED', description: '강의평가 완료' },
] as const;

/** 학과 검색 debounce (ms). */
export const DEPARTMENT_SEARCH_DEBOUNCE_MS = 300;
