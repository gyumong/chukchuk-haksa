import type { SupabaseClient } from '@supabase/supabase-js';
import type { AcademicRecords } from '@/types/domain';
import type { Database } from '@/types/supabase';
import { createClient } from '../server';

interface AcademicSummary {
  totalEarnedCredits: number | null;
  cumulativeGpa: number | null;
  percentile: number | null;
}

interface SemesterGrade {
  year: number;
  semester: number;
  earnedCredits: number;
  attemptedCredits: number;
  semesterGpa: number;
  classRank?: number;
  totalStudents?: number;
}

export class AcademicRecordService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  static async create() {
    const supabase = await createClient();
    return new AcademicRecordService(supabase);
  }


  private async getAuthenticatedUserId(): Promise<string> {
    const { data: userData, error } = await this.supabase.auth.getUser();
    if (error || !userData?.user) {
      throw new Error('User is not authenticated');
    }
    return userData.user.id;
  }

  /**
   * 학기별 성적 정보 저장/업데이트
   */
  async upsertSemesterRecords(studentId: string, records: AcademicRecords['semesters']): Promise<void> {
    const semesterRecords = records.map(record => ({
      student_id: studentId,
      year: record.year,
      semester: record.semester,
      attempted_credits: record.attemptedCredits,
      earned_credits: record.earnedCredits,
      semester_gpa: record.semesterGpa,
      semester_percentile: record.semesterPercentile,
      class_rank: record.classRank,
      total_students: record.totalStudents,
    }));

    const { error } = await this.supabase.from('semester_academic_records').upsert(semesterRecords, {
      onConflict: 'student_id,year,semester',
    });

    if (error) {
      console.error('Failed to upsert semester records:', error);
      throw new Error('학기별 성적 정보 저장에 실패했습니다.');
    }
  }

  /**
   * 전체 성적 요약 정보 저장/업데이트
   */
  async upsertTotalRecord(studentId: string, record: AcademicRecords['total']): Promise<void> {
    const { error } = await this.supabase.from('student_academic_records').upsert(
      {
        student_id: studentId,
        total_attempted_credits: record.totalAttemptedCredits,
        total_earned_credits: record.totalEarnedCredits,
        cumulative_gpa: record.cumulativeGpa,
        percentile: record.percentile,
      },
      {
        onConflict: 'student_id',
      }
    );

    if (error) {
      console.error('Failed to upsert total record:', error);
      throw new Error('전체 성적 정보 저장에 실패했습니다.');
    }
  }

  /**
   * 학생의 모든 성적 정보 저장/업데이트
   */
  async upsertAcademicRecords(studentId: string, academicRecords: AcademicRecords): Promise<void> {
    await Promise.all([
      this.upsertSemesterRecords(studentId, academicRecords.semesters),
      this.upsertTotalRecord(studentId, academicRecords.total),
    ]);
  }

  /**
   * 전체 성적 요약 조회
   */
  async getAcademicSummary(): Promise<AcademicSummary> {
    const userId = await this.getAuthenticatedUserId();
    const { data, error } = await this.supabase
      .from('student_academic_records')
      .select(
        `
          total_earned_credits,
          cumulative_gpa,
          percentile
        `
      )
      .eq('student_id', userId)
      .single();

    if (error) {
      console.error('Failed to fetch academic summary:', error);
      throw new Error('성적 요약 정보 조회 실패');
    }

    return {
      totalEarnedCredits: data.total_earned_credits,
      cumulativeGpa: data.cumulative_gpa,
      percentile: data.percentile,
    };
  }

  /**
   * 학기별 성적 조회
   */
  async getSemesterGrades(): Promise<SemesterGrade[]> {
    const userId = await this.getAuthenticatedUserId();
    const { data, error } = await this.supabase
      .from('semester_academic_records')
      .select(
        `
        year,
        semester,
        earned_credits,
        attempted_credits,
        semester_gpa,
        class_rank,
        total_students
      `
      )
      .eq('student_id', userId)
      .order('year', { ascending: false })
      .order('semester', { ascending: false });

    if (error) {
      console.error('Failed to fetch semester grades:', error);
      throw new Error('학기별 성적 조회 실패');
    }

    return data.map(record => ({
      year: record.year!,
      semester: record.semester!,
      earnedCredits: record.earned_credits!,
      attemptedCredits: record.attempted_credits!,
      semesterGpa: record.semester_gpa!,
      classRank: record.class_rank ?? undefined,
      totalStudents: record.total_students ?? undefined,
    }));
  }
}
