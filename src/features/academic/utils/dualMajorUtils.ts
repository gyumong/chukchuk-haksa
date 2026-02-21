import type { AreaProgress, CourseAreaType } from '../types/graduation';

/**
 * 복수전공 관련 영역 타입들
 */
export const DUAL_MAJOR_AREA_TYPES = ['복선', '복핵', '복교'] as const;

/**
 * 주전공 관련 영역인지 확인
 */
export function isMainMajorArea(areaType: CourseAreaType): boolean {
  return !(DUAL_MAJOR_AREA_TYPES as ReadonlyArray<CourseAreaType>).includes(areaType);
}

/**
 * 복수전공 관련 영역인지 확인
 */
export function isDualMajorArea(areaType: CourseAreaType): boolean {
  return (DUAL_MAJOR_AREA_TYPES as ReadonlyArray<CourseAreaType>).includes(areaType);
}

/**
 * 졸업요건 진도를 주전공과 복수전공으로 분리
 */
export function separateProgressByMajor(graduationProgress: AreaProgress[]) {
  const mainMajorProgress = graduationProgress.filter(area => isMainMajorArea(area.areaType));
  const dualMajorProgress = graduationProgress.filter(area => isDualMajorArea(area.areaType));
  
  return {
    mainMajorProgress,
    dualMajorProgress,
    hasDualMajor: dualMajorProgress.length > 0,
  };
}

/**
 * 복수전공 영역들의 총 학점 계산
 */
export function calculateDualMajorCredits(dualMajorProgress: AreaProgress[]) {
  const earnedCredits = dualMajorProgress.reduce((sum, area) => sum + area.earnedCredits, 0);
  const requiredCredits = dualMajorProgress.reduce((sum, area) => sum + area.requiredCredits, 0);
  
  return {
    earnedCredits,
    requiredCredits,
  };
}