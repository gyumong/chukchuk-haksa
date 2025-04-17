import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types';
import { createClient } from '../server';

interface StudentCourseInsert {
  student_id: string; // FK to students.student_id
  offering_id: number; // FK to course_offerings.id
  grade?: Database['public']['Enums']['grade_type']; // "A+", "B0", ...
  points?: number;
  is_retake?: boolean;
}

export class StudentCourseService {
  constructor(private readonly supabase: SupabaseClient<Database> = createClient()) {}

  /**
   * 학생의 수강 이력을 Upsert
   * - (student_id, offering_id)를 유니크로 설정했다고 가정
   * - 이미 존재하면 UPDATE, 없으면 INSERT
   */
  async upsertStudentCourses(rows: StudentCourseInsert[]): Promise<void> {
    if (!rows.length) {
      return;
    }

    // Supabase upsert
    const { data, error } = await this.supabase
      .from('student_courses')
      .upsert(rows, {
        onConflict: 'student_id,offering_id',
      })
      .select(); // 실제 upsert 결과를 반환

    if (error) {
      console.error('Failed to upsert student_courses:', error);
      throw new Error('Failed to upsert student_courses');
    }

    console.log('Upserted student_courses:', data);
  }

  /**
   * 특정 (student_id, offering_id)에 대해서 grade 등 필드를 업데이트
   * - 부분 업데이트 예시 (Supabase upsert 대신 update)
   */
  async updateStudentCourse(
    studentId: string,
    offeringId: number,
    updates: Partial<Omit<StudentCourseInsert, 'student_id' | 'offering_id'>>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('student_courses')
      .update(updates)
      .match({ student_id: studentId, offering_id: offeringId });

    if (error) {
      console.error(`Failed to update student_courses [${studentId}, ${offeringId}]:`, error);
      throw new Error('Failed to update student_courses record.');
    }
  }
}
