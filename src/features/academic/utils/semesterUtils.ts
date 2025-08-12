import { getSemesterDisplay } from '@/lib/utils/semester';
import type { SemesterGrade } from '../types/graduation';

/**
 * 학기 데이터를 연도와 학기 순서대로 정렬
 */
export function sortSemestersByDate(semesters: SemesterGrade[]): SemesterGrade[] {
  return [...semesters].sort((a, b) => {
    if (a.year !== b.year) {
      return a.year - b.year;
    }
    return a.semester - b.semester;
  });
}

/**
 * 학기 데이터에서 첫 학기와 마지막 학기 정보 추출
 */
export function getAcademicPeriod(semesters: SemesterGrade[]) {
  if (!semesters || semesters.length === 0) {
    return { start: '1학년 1학기', end: '1학년 1학기' };
  }

  const sortedSemesters = sortSemestersByDate(semesters);
  const firstSemester = sortedSemesters[0];
  const lastSemester = sortedSemesters[sortedSemesters.length - 1];

  return {
    start: `${firstSemester.year}년 ${getSemesterDisplay(firstSemester.semester)}`,
    end: `${lastSemester.year}년 ${getSemesterDisplay(lastSemester.semester)}`,
  };
}

/**
 * 가장 최근 학기 정보 반환
 */
export function getLatestSemester(semesters: SemesterGrade[]): SemesterGrade | null {
  if (!semesters || semesters.length === 0) {
    return null;
  }

  const sortedSemesters = sortSemestersByDate(semesters);
  return sortedSemesters[sortedSemesters.length - 1];
}

/**
 * 학기 코드를 문자열로 변환
 */
export function getSemesterLabel(semester: number): string {
  switch (semester) {
    case 10:
      return '1학기';
    case 15:
      return '여름학기';
    case 20:
      return '2학기';
    case 25:
      return '겨울학기';
    default:
      return '';
  }
}

/**
 * 특정 연도와 학기가 유효한지 검증
 */
export function isValidSemester(
  year: number,
  semester: number,
  availableSemesters: SemesterGrade[]
): boolean {
  if (!year || !semester || !availableSemesters) {
    return false;
  }
  
  return availableSemesters.some(s => s.year === year && s.semester === semester);
}

/**
 * URL 파라미터에서 연도와 학기 추출 및 검증
 */
export function parseAndValidateSemesterParams(
  yearParam: string | null,
  semesterParam: string | null
): { year: number; semester: number; isValid: boolean } {
  const year = parseInt(yearParam || '0');
  const semester = parseInt(semesterParam || '0');
  const isValid = Boolean(year && semester);
  
  return { year, semester, isValid };
}