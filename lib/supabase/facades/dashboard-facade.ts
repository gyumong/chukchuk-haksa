import { getSemesterInfo } from '@/lib/utils/semester';
import type { DashboardData } from '@/types/api/dashboard';
import { AcademicRecordService } from '../services/academic-record-service';
import { StudentService } from '../services/student-service';

export class DashboardFacade {
  constructor(
    private readonly studentService = new StudentService(),
    private readonly academicRecordService = new AcademicRecordService()
  ) {}

  async getDashboard(): Promise<DashboardData> {
    // 병렬로 데이터 조회
    const [studentInfo, academicSummary] = await Promise.all([
      this.studentService.getStudentInfo(),
      this.academicRecordService.getAcademicSummary(),
    ]);

    return {
      profile: {
        name: studentInfo.name ?? '',
        studentCode: studentInfo.studentCode ?? '',
        departmentName: studentInfo.departmentName ?? '',
        gradeLevel: studentInfo.gradeLevel ?? 0,
        currentSemester: getSemesterInfo(studentInfo.completedSemesters ?? 0).currentSemester,
        status: studentInfo.status ?? '',
        lastUpdatedAt: studentInfo.updatedAt ?? '',
      },
      summary: {
        earnedCredits: academicSummary.totalEarnedCredits ?? 0,
        requiredCredits: 130, // 기본값이나 학과별로 동적 처리 필요
        cumulativeGpa: academicSummary.cumulativeGpa ?? 0,
        percentile: academicSummary.percentile ?? 0,
      },
    };
  }
}
