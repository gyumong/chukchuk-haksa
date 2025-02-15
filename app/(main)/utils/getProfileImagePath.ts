import { PROFILE_IMAGES, StudentStatus } from '../constants/profile';

export function getProfileImagePath(status: StudentStatus, grade?: number): string {
  if (status === '재학' && grade) {
    const key = `GRADE_${grade}`;
    if (key in PROFILE_IMAGES.ENROLLED) {
      return PROFILE_IMAGES.ENROLLED[key as keyof typeof PROFILE_IMAGES.ENROLLED];
    }
    return PROFILE_IMAGES.DEFAULT;
  }

  if (status === '휴학') {
    return PROFILE_IMAGES.ON_LEAVE;
  }

  return PROFILE_IMAGES.DEFAULT;
}
