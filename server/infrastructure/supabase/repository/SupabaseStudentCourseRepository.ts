// server/infrastructure/supabase/repositories/SupabaseStudentCourseRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { CourseEnrollment } from '@/server/domain/academic-record/models/CourseEnrollment';
import { CourseEnrollments } from '@/server/domain/academic-record/models/CourseEnrollments';
import type { IStudentCourseRepository } from '@/server/domain/academic-record/repositories/IStudentCourseRepository';
import { StudentCourseMapper } from '@/server/infrastructure/supabase/mappers/StudentCourseMapper';
import type { Database } from '@/types/supabase';

export class SupabaseStudentCourseRepository implements IStudentCourseRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async upsertEnrollments(enrollments: CourseEnrollment[]): Promise<void> {
    const records = enrollments.map(enrollment => StudentCourseMapper.toRecord(enrollment));
    const { error } = await this.supabase
      .from('student_courses')
      .upsert(records, { onConflict: 'student_id,offering_id' });
    if (error) {
      throw new Error(`Upsert enrollments failed: ${error.message}`);
    }
  }

  async updateEnrollment(enrollment: CourseEnrollment): Promise<void> {
    const record = StudentCourseMapper.toRecord(enrollment);
    const { error } = await this.supabase
      .from('student_courses')
      .update(record)
      .eq('student_id', enrollment.getStudentId() as string)
      .eq('offering_id', enrollment.getOfferingId() as number);
    if (error) {
      throw new Error(`Update enrollment failed: ${error.message}`);
    }
  }

  async findByStudentId(studentId: string): Promise<CourseEnrollments> {
    const { data, error } = await this.supabase.from('student_courses').select('*').eq('student_id', studentId);
    if (error) {
      throw new Error(`Find enrollments by studentId failed: ${error.message}`);
    }
    const enrollments = data.map(record => StudentCourseMapper.toDomain(record));
    return new CourseEnrollments(enrollments);
  }

  async removeEnrollments(studentId: string, offeringIds: number[]): Promise<void> {
    const { error } = await this.supabase
      .from('student_courses')
      .delete()
      .eq('student_id', studentId)
      .in('offering_id', offeringIds);

    if (error) {
      throw new Error(`Remove enrollments failed: ${error.message}`);
    }
  }
  // 추가적으로 필요에 따라 findBySemester, findByOfferingId 등도 구현할 수 있습니다.
}
