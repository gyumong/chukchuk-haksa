'use client';

import { useEffect } from 'react';
import { getAdmissionYear, getDepartmentName } from '@/features/academic/utils/profileUtils';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { setUserProperties } from '@/lib/analytics';

// 로그인 사용자의 프로필 기반 Amplitude UserProperty(학번/학과 등)를 세팅한다. 렌더 출력 없음.
// useProfileQuery(suspense) 데이터에 의존하므로 AsyncBoundary 안에서 마운트할 것.
// 키 이름은 Notion 텍소노미와 대조해 확정 필요(쉽게 rename 가능).
export function UserPropertiesSync() {
  const { data: profile } = useProfileQuery();

  useEffect(() => {
    setUserProperties({
      student_code: profile.studentCode,
      department: getDepartmentName(profile),
      major: profile.majorName,
      admission_year: getAdmissionYear(profile.studentCode),
      grade_level: profile.gradeLevel,
      ...(profile.dualMajorName ? { dual_major: profile.dualMajorName } : {}),
    });
  }, [profile]);

  return null;
}
