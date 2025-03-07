// server/application/student/usecases/RefreshPortalConnectionUseCase.ts
import type { IAuthService } from '@/server/domain/auth/IAuthService';
import type { IDepartmentRepository } from '@/server/domain/department/repositories/IDepartmentRepository';
import type { StudentInitializationDataType } from '@/server/domain/student/repository/IStudentRepository';
import type { IUserRepository } from '@/server/domain/user/repositories/IUserRepository';
import type { PortalData } from '@/server/infrastructure/portal/dto/PortalDataType';

export interface RefreshPortalConnectionResult {
  isSuccess: boolean;
  error?: string;
}

/**
 * 이미 포털 연동된 사용자가 정정 기간 또는 다음 학기 수강신청 이후에
 * 학적/수강/성적 정보를 재동기화할 때 사용하는 UseCase.
 */
export class RefreshPortalConnectionUseCase {
  constructor(
    private readonly departmentRepository: IDepartmentRepository,
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  // 포털 데이터를 주입받는 execute 메서드
  async executeWithPortalData(portalData: PortalData): Promise<RefreshPortalConnectionResult> {
    try {
      // 1) 현재 로그인된 사용자
      const userId = await this.authService.getAuthenticatedUserId();
      const user = await this.userRepository.findById(userId);
      if (!user) {
        return { isSuccess: false, error: '사용자를 찾을 수 없습니다.' };
      }

      if (!user.isPortalConnected()) {
        return { isSuccess: false, error: '아직 포털 계정과 연결되지 않은 사용자입니다.' };
      }

      const studentPortalData = portalData.student;
      const department = await this.departmentRepository.getOrCreateDepartment({
        code: studentPortalData.department.code,
        name: studentPortalData.department.name,
      });

      const major = studentPortalData.major.code
        ? await this.departmentRepository.getOrCreateDepartment({
            code: studentPortalData.major.code,
            name: studentPortalData.major.name,
          })
        : null;

      const secondaryMajor = studentPortalData.secondaryMajor
        ? await this.departmentRepository.getOrCreateDepartment({
            code: studentPortalData.secondaryMajor.code,
            name: studentPortalData.secondaryMajor.name,
          })
        : null;

      const departmentId = department.getId()?.getValue();
      const majorId = major?.getId()?.getValue();
      if (!departmentId) {
        throw new Error('학과/전공 정보 초기화 실패');
      }

      const studentCreationData: StudentInitializationDataType = {
        studentCode: studentPortalData.studentCode,
        name: studentPortalData.name,
        departmentId,
        majorId: majorId ?? null,
        secondaryMajorId: secondaryMajor?.getId()?.getValue() ?? null,
        admissionYear: studentPortalData.admission.year,
        semesterEnrolled: studentPortalData.admission.semester,
        isTransferStudent: studentPortalData.admission.type.includes('편입'),
        isGraduated: studentPortalData.status === '졸업', // 또는 적절한 enum 변환
        status: studentPortalData.status,
        gradeLevel: studentPortalData.academic.gradeLevel,
        completedSemesters: studentPortalData.academic.completedSemesters,
        admissionType: studentPortalData.admission.type,
      };

      // SupabaseUserRepository.refreshPortalConnection() 호출
      // -> 내부적으로 'refresh_portal_connection' RPC 실행
      await this.userRepository.refreshPortalConnection(userId, studentCreationData);

      return { isSuccess: true };
    } catch (err) {
      return { isSuccess: false, error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' };
    }
  }
}
