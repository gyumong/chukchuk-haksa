import type { SupabaseClient } from '@supabase/supabase-js';
import type { AcademicRecord } from '@/server/domain/academic-record/models/AcademicRecord';
import type { IAcademicRecordRepository } from '@/server/domain/academic-record/repositories/IAcademicRecordRepository';
import type { Database } from '@/types';
import { AcademicRecordMapper } from '../mappers/AcademicRecordMapper';

// server/infrastructure/supabase/repositories/SupabaseAcademicRecordRepository.ts
export class SupabaseAcademicRecordRepository implements IAcademicRecordRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async upsertAcademicRecord(record: AcademicRecord): Promise<void> {
    const studentId = record.getStudentId();
    if (!studentId) {
      throw new Error('Student ID is required for upsert');
    }

    const { semesterRecords, summary } = AcademicRecordMapper.toPersistence(record);

    const { error } = await this.supabase.rpc('upsert_academic_record', {
      p_student_id: studentId,
      p_semester_grades: semesterRecords,
      p_academic_summary: summary,
    });

    if (error) {
      throw new Error(`Failed to upsert academic record: ${error.message}`);
    }
  }

  async findByStudentId(studentId: string): Promise<AcademicRecord | null> {
    const [semesterGrades, summary] = await Promise.all([
      this.supabase
        .from('semester_academic_records')
        .select('*')
        .eq('student_id', studentId)
        .order('year', { ascending: true })
        .order('semester', { ascending: true }),

      this.supabase.from('student_academic_records').select('*').eq('student_id', studentId).single(),
    ]);

    if (semesterGrades.error) {
      throw new Error(`Failed to fetch semester grades: ${semesterGrades.error.message}`);
    }

    if (summary.error || !summary.data || semesterGrades.data.length === 0) {
      return null;
    }

    return AcademicRecordMapper.toDomain(studentId, semesterGrades.data, summary.data);
  }

  async findByStudentIds(studentIds: string[]): Promise<AcademicRecord[]> {
    if (!studentIds.length) {
      return [];
    }

    const [semesterGrades, summaries] = await Promise.all([
      this.supabase
        .from('semester_academic_records')
        .select('*')
        .in('student_id', studentIds)
        .order('year', { ascending: true })
        .order('semester', { ascending: true }),

      this.supabase.from('student_academic_records').select('*').in('student_id', studentIds),
    ]);

    if (semesterGrades.error || summaries.error) {
      throw new Error('Failed to fetch academic records');
    }
    // 학생별로 학기 성적 데이터 그룹화
    const gradesByStudent = new Map<string, typeof semesterGrades.data>();

    for (const grade of semesterGrades.data) {
      if (!grade.student_id) {
        continue;
      }
      const studentGrades = gradesByStudent.get(grade.student_id) || [];
      studentGrades.push(grade);
      gradesByStudent.set(grade.student_id, studentGrades);
    }

    return summaries.data
      .filter((summary): summary is typeof summary & { student_id: string } => Boolean(summary.student_id))
      .map(summary =>
        AcademicRecordMapper.toDomain(summary.student_id, gradesByStudent.get(summary.student_id) || [], summary)
      );
  }

  async findBySemester(studentId: string, year: number, semester: number): Promise<AcademicRecord | null> {
    const record = await this.findByStudentId(studentId);
    if (!record) {
      return null;
    }

    const semesterGrade = record
      .getSemesters()
      .find(grade => grade.getYear() === year && grade.getSemester() === semester);

    if (!semesterGrade) {
      return null;
    }

    return record;
  }
}
