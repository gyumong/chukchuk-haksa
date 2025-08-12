export type StudentStatus = '재학' | '휴학' | '졸업';

export const PROFILE_IMAGES = {
  ENROLLED: {
    GRADE_1: '/images/illustrations/Profile_Enrolled_1.png',
    GRADE_2: '/images/illustrations/Profile_Enrolled_2.png',
    GRADE_3: '/images/illustrations/Profile_Enrolled_3.png',
    GRADE_4: '/images/illustrations/Profile_Enrolled_4.png',
  },
  ON_LEAVE: '/images/illustrations/Profile_OnLeave.png',
  DEFAULT: '/images/illustrations/DefaultProfile.png',
} as const;
