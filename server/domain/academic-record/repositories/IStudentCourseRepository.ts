import { CourseEnrollment } from '../models/CourseEnrollment';
import { CourseEnrollments } from '../models/CourseEnrollments';

// server/domain/academic-record/repositories/IStudentCourseRepository.ts
export interface IStudentCourseRepository {
  /**
   * 수강 이력 저장/업데이트
   */
  upsertEnrollments(enrollments: CourseEnrollment[]): Promise<void>;

  /**
   * 단일 수강 이력 업데이트
   */
  updateEnrollment(enrollment: CourseEnrollment): Promise<void>;

  /**
   * 학생의 모든 수강 이력 조회
   */
  findByStudentId(studentId: string): Promise<CourseEnrollments>;

  /**
   * 특정 학기의 수강 이력 조회
   */
  // findBySemester(studentId: string, year: number, semester: number): Promise<CourseEnrollments>;

  /**
   * 특정 과목의 수강 이력 조회
   */
  // findByOfferingId(studentId: string, offeringId: number): Promise<CourseEnrollment | null>;

  /**
   * 여러 학생들의 특정 과목 수강 이력 조회
   */
  // findByOfferingIdAndStudentIds(offeringId: number, studentIds: string[]): Promise<CourseEnrollment[]>;
}
