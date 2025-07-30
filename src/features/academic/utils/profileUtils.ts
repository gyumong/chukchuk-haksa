/**
 * 학번에서 입학년도 추출
 */
export function getAdmissionYear(studentCode: string): string {
  return studentCode.slice(0, 2);
}

/**
 * 프로필 정보에서 학과명 추출 (departmentName 우선, 없으면 majorName)
 */
export function getDepartmentName(profile: { departmentName?: string; majorName?: string }): string {
  return profile.departmentName ?? profile.majorName ?? '';
}

/**
 * 졸업요건 페이지 제목 생성
 */
export function createGraduationTitle(studentCode: string, profile: { departmentName?: string; majorName?: string }): string {
  const admissionYear = getAdmissionYear(studentCode);
  const departmentName = getDepartmentName(profile);
  return `${admissionYear}학번 ${departmentName} 졸업요건`;
}