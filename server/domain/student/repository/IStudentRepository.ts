import type { StudentStatusType } from '../models/AcademicInfo';
import type { Student } from '../models/Student';

export interface StudentCreationDataType {
  studentCode: string;
  name: string;
  departmentCode: string;
  departmentName: string;
  majorCode: string;
  majorName: string;
  secondaryMajorCode?: string;
  secondaryMajorName?: string;
  admissionYear: number;
  semesterEnrolled: number; // 10, 15, 20, 25
  isTransferStudent: boolean;
  status: StudentStatusType;
  gradeLevel: number;
  completedSemesters: number;
}

export interface StudentInitializationDataType {
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

export interface IStudentRepository {
  /**
   * 학생 정보 저장 (생성/수정)
   */
  save(student: Student, userId: string): Promise<Student>;

  /**
   * ID로 학생 조회
   */
  findById(id: string): Promise<Student | null>;

  /**
   * 학번으로 학생 조회
   */
  findByCode(code: string): Promise<Student | null>;

  /**
   * 학과 ID로 학생 목록 조회
   */
  findByDepartmentId(departmentId: number): Promise<Student[]>;

  /**
   * 전공 ID로 학생 목록 조회
   */
  findByMajorId(majorId: number): Promise<Student[]>;

  /**
   * 학생 정보 업데이트
   */
  update(student: Student): Promise<void>;

  /**
   * 학생 목표 학점 업데이트
   */
  updateTargetGpa(studentId: string, targetGpa: number): Promise<void>;

  /**
   * 학생 정보 삭제
   */
  delete(studentId: string): Promise<void>;
}
