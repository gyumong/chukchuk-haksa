import type { StudentStatus } from '../constants/profile';
import { PROFILE_IMAGES } from '../constants/profile';

export function getProfileImagePath(status: string, grade?: number): string {
  // 서버에서 온 status를 안전하게 StudentStatus로 변환
  const normalizedStatus = status as StudentStatus;
  
  if (normalizedStatus === '재학' && grade) {
    const key = `GRADE_${grade}`;
    if (key in PROFILE_IMAGES.ENROLLED) {
      return PROFILE_IMAGES.ENROLLED[key as keyof typeof PROFILE_IMAGES.ENROLLED];
    }
    return PROFILE_IMAGES.DEFAULT;
  }

  if (normalizedStatus === '휴학') {
    return PROFILE_IMAGES.ON_LEAVE;
  }

  return PROFILE_IMAGES.DEFAULT;
}
