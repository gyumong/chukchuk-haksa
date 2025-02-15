import type { StudentStatus } from '../contants/profile';
import { PROFILE_IMAGES } from '../contants/profile';

export function getProfileImagePath(status: StudentStatus, grade?: number): string {
  if (status === '재학' && grade) {
    return PROFILE_IMAGES.ENROLLED[`GRADE_${grade}` as keyof typeof PROFILE_IMAGES.ENROLLED] ?? PROFILE_IMAGES.DEFAULT;
  }

  if (status === '휴학') {
    return PROFILE_IMAGES.ON_LEAVE;
  }

  return PROFILE_IMAGES.DEFAULT;
}
