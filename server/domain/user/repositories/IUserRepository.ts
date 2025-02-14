// server/domain/user/repositories/IUserRepository.ts
import { StudentStatusType } from '../../student/models/AcademicInfo';
import { User } from '../models/User';

export interface StudentInitializationData {
  studentCode: string;
  name: string;
  departmentId: number;
  majorId: number;
  secondaryMajorId?: number | null;
  admissionYear: number;
  semesterEnrolled: number;
  isTransferStudent: boolean;
  isGraduated: boolean; // 추가
  status: StudentStatusType;
  gradeLevel: number;
  completedSemesters: number;
  admissionType?: string;
}

export interface IUserRepository {
  /**
   * ID로 사용자 조회
   */
  findById(id: string): Promise<User | null>;

  /**
   * 사용자 저장 (생성/수정)
   */
  //   save(user: User): Promise<User>;

  /**
   * 사용자 삭제
   */
  delete(userId: string): Promise<void>;

  /**
   * 포털 연동 초기화
   * - users 테이블의 portal_connected, connected_at 업데이트
   * - students 테이블에 학생 정보 생성
   * DB 트랜잭션으로 처리됨
   */
  initializePortalConnection(userId: string, studentData: StudentInitializationData): Promise<void>;
}
