export interface DashboardData {
  // 학생 기본 정보
  profile: {
    name: string | null;
    studentCode: string;
    departmentName: string | null;
    majorName: string | null;
    gradeLevel: number | null;
    currentSemester: number;
    status: string | null;
    lastUpdatedAt: string | null;
  };

  // 학업 성과 요약
  summary: {
    earnedCredits: number | null; // 취득 학점
    requiredCredits: number | null; // 졸업 필요 학점
    cumulativeGpa: number | null; // 전체 평점
    percentile: number | null; // 백분위
  };
}
