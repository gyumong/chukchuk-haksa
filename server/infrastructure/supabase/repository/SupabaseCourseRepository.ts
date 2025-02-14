// server/infrastructure/supabase/repositories/SupabaseCourseRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { Course } from '@/server/domain/course/models/Course';
import type { ICourseRepository } from '@/server/domain/course/repositories/ICourseRepository';
import type { Database } from '@/types';

export class SupabaseCourseRepository implements ICourseRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  /**
   * course_code를 기준으로 courses 테이블에서 강의 레코드를 조회합니다.
   * 조회 결과가 있으면 도메인 모델로 재구성하여 반환합니다.
   * 없으면 null을 반환합니다.
   */
  async findByCourseCode(courseCode: string): Promise<Course | null> {
    const { data, error } = await this.supabase
      .from('courses')
      .select('id, course_code, course_name')
      .eq('course_code', courseCode)
      .single();

    if (error || !data) {
      return null;
    }

    return Course.reconstitute({
      id: data.id,
      courseCode: data.course_code,
      courseName: data.course_name || '',
    });
  }

  /**
   * 도메인 모델인 Course를 기반으로 courses 테이블에 강의를 생성합니다.
   * 생성 후 반환된 데이터로 도메인 모델을 재구성합니다.
   */
  async createCourse(course: Course): Promise<Course> {
    const payload = {
      course_code: course.getCourseCode(),
      course_name: course.getCourseName(),
    };

    const { data, error } = await this.supabase
      .from('courses')
      .insert(payload)
      .select('id, course_code, course_name')
      .single();

    if (error || !data) {
      console.error('Failed to create course:', error);
      throw new Error('Failed to create course');
    }

    return Course.reconstitute({
      id: data.id,
      courseCode: data.course_code,
      courseName: data.course_name || '',
    });
  }

  /**
   * 주어진 강의 정보(courseCode, courseName, points)를 기준으로 강의를 조회합니다.
   * 조회 결과가 없으면 새로 생성하여 도메인 모델로 반환합니다.
   */
  async getOrCreateCourse(courseData: { courseCode: string; courseName: string; points: number }): Promise<Course> {
    const existingCourse = await this.findByCourseCode(courseData.courseCode);
    if (existingCourse) {
      return existingCourse;
    }
    // 도메인 모델 생성 (필요한 비즈니스 검증을 Course.create에서 수행)
    const newCourse = Course.create({
      courseCode: courseData.courseCode,
      courseName: courseData.courseName,
      points: courseData.points,
    });
    return this.createCourse(newCourse);
  }
}
