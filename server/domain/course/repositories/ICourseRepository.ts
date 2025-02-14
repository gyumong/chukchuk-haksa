// server/domain/course/repositories/ICourseRepository.ts
import { Course } from '@/server/domain/course/models/Course';

/**
 * ICourseRepository
 * - 강의(코스) 관련 데이터를 조회 및 생성하는 역할을 추상화한 인터페이스입니다.
 */
export interface ICourseRepository {
  /**
   * 주어진 courseCode로 강의(코스)를 조회합니다.
   * @param courseCode - 강의 고유 코드
   * @returns 강의가 존재하면 Course 도메인 모델을, 그렇지 않으면 null을 반환합니다.
   */
  findByCourseCode(courseCode: string): Promise<Course | null>;

  /**
   * 새 강의(코스) 레코드를 생성합니다.
   * @param course - 생성할 Course 도메인 모델
   * @returns 생성된 강의(코스) 도메인 모델 (새로운 ID가 할당됨)
   */
  createCourse(course: Course): Promise<Course>;

  /**
   * 주어진 강의 정보로 강의를 조회합니다.
   * 만약 강의가 존재하지 않으면 새로 생성하여 반환합니다.
   * @param courseData - 강의 생성에 필요한 데이터 (courseCode, courseName, points)
   * @returns 조회되거나 생성된 Course 도메인 모델
   */
  getOrCreateCourse(courseData: { courseCode: string; courseName: string; points: number }): Promise<Course>;
}
