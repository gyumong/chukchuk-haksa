import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types';
import { createClient } from '../server';

interface CourseOfferingInsert {
  course_id: number; // FK to courses.id
  year: number;
  semester: number;
  class_section?: string;
  professor_id?: number;
  department_id?: number | null;
  schedule_summary?: string;
  evaluation_type_code?: Database['public']['Enums']['evaluation_type'];
  is_video_lecture?: boolean;
  subject_establishment_semester?: number;
  faculty_division_name?: string;
  area_code?: number;
  original_area_code?: number;
  points?: number; // 학점
  host_department?: string;
}

/**
 * CourseOfferingService
 *  - course_offerings 테이블에 대한 로직
 */
export class CourseOfferingService {
  constructor(private readonly supabase: SupabaseClient<Database> = createClient()) {}

  /**
   * 특정 (course_id, year, semester, class_section, professor_id)로 레코드 찾기
   */
  async getOfferingId(
    courseId: number,
    year: number,
    semester: number,
    classSection?: string,
    professorId?: number
  ): Promise<number | null> {
    let query = this.supabase
      .from('course_offerings')
      .select('id')
      .eq('course_id', courseId)
      .eq('year', year)
      .eq('semester', semester);

    if (classSection) {
      query = query.eq('class_section', classSection);
    } else {
      query = query.is('class_section', null);
    }

    if (professorId) {
      query = query.eq('professor_id', professorId);
    } else {
      query = query.is('professor_id', null);
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return null;
    }
    return data.id;
  }

  /**
   * course_offerings 레코드 생성
   */
  async createOffering(offering: CourseOfferingInsert): Promise<number> {
    const { data, error } = await this.supabase.from('course_offerings').insert(offering).select('id').single();

    if (error || !data) {
      console.error('Failed to create course_offering:', error);
      throw new Error('Failed to create course_offering');
    }

    return data.id;
  }

  /**
   * getOrCreateOffering
   *   - 주어진 (course_id, year, semester, class_section, professor_id) 조합으로 검색
   *   - 없으면 create
   */
  async getOrCreateOffering(offering: CourseOfferingInsert): Promise<number> {
    const existingId = await this.getOfferingId(
      offering.course_id,
      offering.year,
      offering.semester,
      offering.class_section,
      offering.professor_id
    );
    if (existingId) {
      return existingId;
    }

    return this.createOffering(offering);
  }
}
