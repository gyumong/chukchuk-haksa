// 보호 페이지(Phase 2)가 빈 화면/에러 없이 렌더되도록 연동 계정에 학업 데이터를 심는다.
//
// /main·/academic-detail·/graduation-progress 가 모두 비어있지 않으려면:
//  - 학기 2~3개 (SemesterSlider 범위 + academic-detail 의 최신학기 redirect)
//  - 전공(전핵/전선) + 교양(중핵/선교/기교) 영역 (academic-detail 의 '전공'/'교양' 섹션)
import { expect } from '@playwright/test';
import { addTestCourse, adminReset, fetchIsPortalLinked, getTestOptions, setMajor, type TestUser } from './admin';

export interface SeededAcademics {
  latestYear: number;
  latestSemester: number;
}

export async function seedLinkedAcademics(user: TestUser): Promise<SeededAcademics> {
  // 재사용 계정 대비 idempotency (새 계정엔 무해 — 수강/전공 초기화).
  await adminReset(user.accessToken);

  const { departments } = await getTestOptions();
  expect(departments.length, 'test-options 에 학과가 1개 이상 있어야 함').toBeGreaterThan(0);
  const dept = departments[0];

  await setMajor(user.accessToken, {
    majorDepartmentId: dept.id,
    dualMajorEnabled: false,
    secondaryMajorDepartmentId: null,
  });

  // year 오름차순 → 마지막 원소(2022/10)가 최신학기가 되도록 (academic-detail 의 latest redirect 가정).
  const courses = [
    { year: 2021, semester: 10, area: '전핵', courseName: 'E2E 전공핵심 A', credits: 3, grade: 'A+' },
    { year: 2021, semester: 10, area: '중핵', courseName: 'E2E 중핵교양 A', credits: 3, grade: 'A+' },
    { year: 2021, semester: 20, area: '전선', courseName: 'E2E 전공선택 A', credits: 3, grade: 'A0' },
    { year: 2021, semester: 20, area: '선교', courseName: 'E2E 선택교양 A', credits: 2, grade: 'B+' },
    { year: 2022, semester: 10, area: '전핵', courseName: 'E2E 전공핵심 B', credits: 3, grade: 'A+' },
    { year: 2022, semester: 10, area: '기교', courseName: 'E2E 기초교양 B', credits: 2, grade: 'A+' },
  ] as const;

  for (const course of courses) {
    await addTestCourse(user.accessToken, {
      ...course,
      departmentId: dept.id,
      isRetake: false,
      originalScore: null,
    });
  }

  return { latestYear: 2022, latestSemester: 10 };
}

// 보호 페이지 진입 전에 백엔드 상태를 직접 확인해 빠르게 실패시킨다
// (계정/연동 플래그 문제를 UI 단언 전에 표면화 — admin 연동 필드가 안 먹으면 여기서 잡힌다).
export async function verifyLinkedReady(user: TestUser): Promise<void> {
  const isLinked = await fetchIsPortalLinked(user.accessToken);
  expect(isLinked, '연동 계정의 /api/users/me isPortalLinked 가 true 여야 함').toBe(true);
}
