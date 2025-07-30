import type { CourseAreaType, AreaProgress } from '../types/graduation';

/**
 * 과목 영역 타입을 한글 표시명으로 변환
 */
export function getCourseAreaDisplayName(areaType: CourseAreaType): string {
  const areaNames: Record<CourseAreaType, string> = {
    중핵: '중핵교양',
    기교: '기초교양', 
    선교: '선택교양',
    소교: '소양교양',
    전교: '전공교양',
    전취: '전공취업',
    전핵: '전공핵심',
    전선: '전공선택',
    일선: '일반선택',
    복선: '복수전공선택',
  };
  return areaNames[areaType] || areaType;
}

/**
 * 영역 진도가 완료되었는지 판단
 */
export function isAreaCompleted(area: AreaProgress): boolean {
  return (
    area.earnedCredits >= area.requiredCredits &&
    area.completedElectiveCourses >= area.requiredElectiveCourses
  );
}