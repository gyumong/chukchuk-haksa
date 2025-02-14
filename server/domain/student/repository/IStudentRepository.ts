import { Student } from '../models/Student';

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
