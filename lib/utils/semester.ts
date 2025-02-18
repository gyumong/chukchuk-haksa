/**
 * 학기 종류를 나타내는 타입
 */
export type SemesterType = '1' | '2' | '여름' | '겨울';

/**
 * 학년(gradeLevel)과 정규 이수학기(completedSemesters)를 기반으로 현재 학기를 계산
 * @param gradeLevel 현재 학년
 * @param completedSemesters 정규 이수학기 수
 * @returns { currentSemester: number } - 1 또는 2
 */
export function getSemesterInfo(gradeLevel: number, completedSemesters: number) {
  // 해당 학년 이전에 완료해야 하는 최소 학기 수
  const expectedCompleted = (gradeLevel - 1) * 2;

  // 만약 completedSemesters가 예상보다 낮으면 최소값으로 간주 (방학 중 업데이트가 안된 경우 대비)
  const effectiveCompleted = Math.max(completedSemesters, expectedCompleted);

  // 현재 학기는, (실제 완료 학기 - 예상 완료 학기) + 1
  let currentSemester = effectiveCompleted - expectedCompleted + 1;

  // currentSemester는 1 또는 2만 나와야 함
  if (currentSemester < 1) {
    currentSemester = 1;
  }
  if (currentSemester > 2) {
    currentSemester = 2;
  }

  return {
    currentSemester,
  };
}

/**
 * 학기를 학기 코드로 변환
 * @param semester 학기 ('1', '2', '여름', '겨울')
 * @returns 학기 코드 (10, 15, 20, 25)
 */
export function getSemesterCode(semester: SemesterType): number {
  switch (semester) {
    case '1':
      return 10;
    case '여름':
      return 15;
    case '2':
      return 20;
    case '겨울':
      return 25;
    default:
      throw new Error('Invalid semester');
  }
}

/**
 * 학기 코드를 학기로 변환
 * @param semesterCode 학기 코드 (10, 15, 20, 25)
 * @returns 학기 ('1', '2', '여름', '겨울')
 *
 * @example
 * getSemesterFromCode(10) // '1'
 * getSemesterFromCode(15) // '여름'
 * getSemesterFromCode(20) // '2'
 * getSemesterFromCode(25) // '겨울'
 */
export function getSemesterFromCode(semesterCode: number): SemesterType {
  switch (semesterCode) {
    case 10:
      return '1';
    case 15:
      return '여름';
    case 20:
      return '2';
    case 25:
      return '겨울';
    default:
      throw new Error('Invalid semester code');
  }
}

/**
 * 학기 코드를 표시용 문자열로 변환
 * @param semesterCode 학기 코드 (10, 15, 20, 25)
 * @returns 표시용 학기 문자열 ('1학기', '여름학기', '2학기', '겨울학기')
 */
export function getSemesterDisplay(semesterCode: number): string {
  const semester = getSemesterFromCode(semesterCode);
  return `${semester}학기`;
}

/**
 * 정규학기 여부 확인
 * @param semesterCode 학기 코드
 * @returns 정규학기 여부
 */
export function isRegularSemester(semesterCode: number): boolean {
  return semesterCode === 10 || semesterCode === 20;
}
