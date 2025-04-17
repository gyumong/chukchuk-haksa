import { getSemesterInfo } from '@/lib/utils/semester';
import type { IAuthService } from '@/server/domain/auth/IAuthService';
import type { IUserRepository } from '@/server/domain/user/repositories/IUserRepository';
import type { DashboardData } from '@/types/api/dashboard';
import { AcademicRecordService } from '../services/academic-record-service';
import { StudentService } from '../services/student-service';
import { SupabaseAuthService } from '@/server/infrastructure/supabase/SupabaseAuthService';
import { SupabaseUserRepository } from '@/server/infrastructure/supabase/repository/SupabaseUserRepository';
import { createClient } from '@/lib/supabase/server';

export class DashboardFacade {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService,
    private readonly studentService: StudentService,
    private readonly academicRecordService: AcademicRecordService
  ) {}

  static async create() {
    const supabase = await createClient();
    const userRepository = new SupabaseUserRepository(supabase);
    const authService = new SupabaseAuthService(supabase);
    const studentService = await StudentService.create();
    const academicRecordService = await AcademicRecordService.create();
    return new DashboardFacade(userRepository, authService, studentService, academicRecordService);
  }

  async getDashboard(): Promise<DashboardData> {
    // 병렬로 데이터 조회
    const [studentInfo, academicSummary] = await Promise.all([
      this.studentService.getStudentInfo(),
      this.academicRecordService.getAcademicSummary(),
    ]);

    const userId = await this.authService.getAuthenticatedUserId();
    const user = await this.userRepository.findById(userId);

    return {
      profile: {
        name: studentInfo.name ?? '',
        studentCode: studentInfo.studentCode ?? '',
        departmentName: studentInfo.departmentName ?? '',
        majorName: studentInfo.majorName ?? '',
        gradeLevel: studentInfo.gradeLevel ?? 0,
        currentSemester: getSemesterInfo(studentInfo.gradeLevel ?? 0, studentInfo.completedSemesters ?? 0)
          .currentSemester,
        status: studentInfo.status ?? '',
        lastUpdatedAt: studentInfo.updatedAt ?? '',
      },
      summary: {
        earnedCredits: academicSummary.totalEarnedCredits ?? 0,
        requiredCredits: 130, // 기본값이나 학과별로 동적 처리 필요
        cumulativeGpa: academicSummary.cumulativeGpa ?? 0,
        percentile: academicSummary.percentile ?? 0,
      },
      user: {
        lastSyncedAt: user?.getLastSyncedAt()?.toISOString() ?? '',
      },
    };
  }
}
