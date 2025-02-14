import type { IAuthService } from '@/server/domain/auth/IAuthService';
import type { IDepartmentRepository } from '@/server/domain/department/repositories/IDepartmentRepository';
import type { IPortalRepository } from '@/server/domain/portal/repository/IPortalRepository';
import type { StudentStatusType } from '@/server/domain/student/models/AcademicInfo';
import { StudentStatus } from '@/server/domain/student/models/AcademicInfo';
import type { StudentInitializationDataType } from '@/server/domain/student/repository/IStudentRepository';
import type { IUserRepository } from '@/server/domain/user/repositories/IUserRepository';
import type { PortalData } from '@/server/infrastructure/portal/dto/PortalDataType';

export interface InitializePortalConnectionResult {
  isSuccess: boolean;
  studentId?: string;
  error?: string;
}

export class InitializePortalConnectionUseCase {
  constructor(
    private readonly portalRepository: IPortalRepository,
    private readonly departmentRepository: IDepartmentRepository,
    private readonly userRepository: IUserRepository,
    private readonly authService: IAuthService
  ) {}

  /**
   * 포털 데이터를 가져오고, 해당 학생의 학과/전공 정보를 조회 또는 생성한 후,
   * 학생의 포털 연동을 초기화합니다.
   *
   * @param username - 포털 로그인 시 사용할 학번 혹은 사용자명
   * @param password - 포털 로그인 비밀번호
   * @returns 연동 성공 여부 및 studentId, 에러 메시지 (실패 시)
   */
  async execute(username: string, password: string): Promise<InitializePortalConnectionResult> {
    try {
      // 1. 포털에서 학생 관련 원시 데이터를 가져옵니다.
      const portalData = await this.portalRepository.fetchPortalData(username, password);
      const studentPortalData = portalData.student;

      // 2. 인증된 사용자 ID를 획득합니다.
      const userId = await this.authService.getAuthenticatedUserId();

      // 3. 해당 사용자의 포털 연동 상태를 확인합니다.
      const user = await this.userRepository.findById(userId);
      if (user && user.isPortalConnected()) {
        return { isSuccess: false, error: '이미 포털 계정과 연동된 사용자입니다.' };
      }

      // 학과/전공 정보 초기화
      const [department, major] = await Promise.all([
        this.departmentRepository.getOrCreateDepartment({
          code: studentPortalData.department.code,
          name: studentPortalData.department.name,
        }),
        this.departmentRepository.getOrCreateDepartment({
          code: studentPortalData.major.code,
          name: studentPortalData.major.name,
        }),
      ]);
      // 복수전공 정보 초기화 (없으면 null)
      const secondaryMajor = studentPortalData.secondaryMajor
        ? await this.departmentRepository.getOrCreateDepartment({
            code: studentPortalData.secondaryMajor.code,
            name: studentPortalData.secondaryMajor.name,
          })
        : null;

      const departmentId = department.getId()?.getValue();
      const majorId = major.getId()?.getValue();
      if (!departmentId || !majorId) {
        throw new Error('학과/전공 정보 초기화 실패');
      }

      // 5. 학생 생성에 필요한 데이터를 준비합니다.
      const studentCreationData: StudentInitializationDataType = {
        studentCode: studentPortalData.studentCode,
        name: studentPortalData.name,
        departmentId,
        majorId,
        secondaryMajorId: secondaryMajor?.getId()?.getValue() ?? null,
        admissionYear: studentPortalData.admission.year,
        semesterEnrolled: studentPortalData.admission.semester,
        isTransferStudent: studentPortalData.admission.type.includes('편입'),
        isGraduated: studentPortalData.status === StudentStatus.졸업,
        status: studentPortalData.status as StudentStatusType,
        gradeLevel: studentPortalData.academic.gradeLevel,
        completedSemesters: studentPortalData.academic.completedSemesters,
        admissionType: studentPortalData.admission.type,
      };

      // 6. 포털 연동 초기화를 수행합니다.
      //    (사용자 데이터 업데이트 및 학생 테이블에 데이터 생성)
      await this.userRepository.initializePortalConnection(userId, studentCreationData);

      return { isSuccess: true, studentId: studentCreationData.studentCode };
    } catch (error) {
      return {
        isSuccess: false,
        error: error instanceof Error ? error.message : '포털 연동 중 오류가 발생했습니다.',
      };
    }
  }

  // 포털 데이터를 주입받는 execute 메서드
  async executeWithPortalData(portalData: PortalData): Promise<InitializePortalConnectionResult> {
    try {
      const studentPortalData = portalData.student;
      const userId = await this.authService.getAuthenticatedUserId();
      const user = await this.userRepository.findById(userId);
      if (user && user.isPortalConnected()) {
        return { isSuccess: false, error: '이미 포털 계정과 연동된 사용자입니다.' };
      }

      const [department, major] = await Promise.all([
        this.departmentRepository.getOrCreateDepartment({
          code: studentPortalData.department.code,
          name: studentPortalData.department.name,
        }),
        this.departmentRepository.getOrCreateDepartment({
          code: studentPortalData.major.code,
          name: studentPortalData.major.name,
        }),
      ]);
      const secondaryMajor = studentPortalData.secondaryMajor
        ? await this.departmentRepository.getOrCreateDepartment({
            code: studentPortalData.secondaryMajor.code,
            name: studentPortalData.secondaryMajor.name,
          })
        : null;

      const departmentId = department.getId()?.getValue();
      const majorId = major.getId()?.getValue();
      if (!departmentId || !majorId) {
        throw new Error('학과/전공 정보 초기화 실패');
      }

      const studentCreationData: StudentInitializationDataType = {
        studentCode: studentPortalData.studentCode,
        name: studentPortalData.name,
        departmentId,
        majorId,
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

      await this.userRepository.initializePortalConnection(userId, studentCreationData);
      return { isSuccess: true, studentId: studentCreationData.studentCode };
    } catch (error) {
      return {
        isSuccess: false,
        error: error instanceof Error ? error.message : '포털 연동 중 오류가 발생했습니다.',
      };
    }
  }
}
