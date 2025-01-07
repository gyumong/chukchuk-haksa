import { SupabaseClient } from '@supabase/supabase-js';
import { Database, PartialCourseData } from '@/types';
import { createClient } from '../server';

/** 임시 과목 정보 */
interface TemporaryCourseInfo {
  courseCode: string;
  courseName: string;
  points: number;
}

export class CourseService {
  constructor(private readonly supabase: SupabaseClient<Database> = createClient()) {}

  /**
   * course_code로 courses.id (PK) 조회
   */
  async getCourseIdByCoursesCode(courseCode: string): Promise<number | null> {
    const { data, error } = await this.supabase.from('courses').select('id').eq('course_code', courseCode).single();

    if (error || !data) {
      return null;
    }
    return data.id;
  }

  /**
   * 최소 데이터로 courses 레코드 생성
   */
  async createCourse(subjectCode: string, partialCourse: TemporaryCourseInfo): Promise<number> {
    const { data, error } = await this.supabase
      .from('courses')
      .insert({
        // 필요한 DB 컬럼만 넣음
        course_code: subjectCode,
        course_name: partialCourse.courseName,
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('Failed to create course:', error);
      throw new Error('Failed to create course');
    }

    return data.id;
  }

  /**
   * getOrCreateCourse
   *  - course_code(= subjectCode)로 찾고, 없으면 create
   */
  async getOrCreateCourse(courseCode: string, partialCourse: TemporaryCourseInfo): Promise<number> {
    const existingId = await this.getCourseIdByCoursesCode(courseCode);
    if (existingId) {
      return existingId;
    }

    return this.createCourse(courseCode, partialCourse);
  }
}
