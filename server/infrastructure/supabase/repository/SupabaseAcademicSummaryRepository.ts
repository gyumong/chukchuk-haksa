// server/infrastructure/supabase/repositories/SupabaseAcademicSummaryRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { AcademicSummary } from '@/server/domain/academic-record/models/AcademicSummary';
import type { IAcademicSummaryRepository } from '@/server/domain/academic-record/repositories/IAcademicSummaryRepository';
import type { Database } from '@/types';

export class SupabaseAcademicSummaryRepository implements IAcademicSummaryRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async upsertSummary(studentId: string, summary: AcademicSummary): Promise<void> {
    const { error } = await this.supabase.from('student_academic_records').upsert(
      {
        student_id: studentId,
        total_attempted_credits: summary.getTotalAttemptedCredits(),
        total_earned_credits: summary.getTotalEarnedCredits(),
        cumulative_gpa: summary.getCumulativeGpa(),
        percentile: summary.getPercentile(),
        attempted_credits_gpa: summary.getAttemptedCreditsGpa(),
      },
      {
        onConflict: 'student_id',
      }
    );

    if (error) {
      throw new Error(`Failed to upsert academic summary: ${error.message}`);
    }
  }

  async findByStudentId(studentId: string): Promise<AcademicSummary | null> {
    const { data, error } = await this.supabase
      .from('student_academic_records')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error || !data) {
      return null;
    }

    return new AcademicSummary(
      data.total_attempted_credits,
      data.total_earned_credits,
      data.cumulative_gpa,
      data.percentile,
      data.attempted_credits_gpa
    );
  }

  async findByStudentIds(studentIds: string[]): Promise<AcademicSummary[]> {
    if (!studentIds.length) {return [];}

    const { data, error } = await this.supabase
      .from('student_academic_records')
      .select('*')
      .in('student_id', studentIds);

    if (error) {
      throw new Error(`Failed to fetch academic summaries: ${error.message}`);
    }

    return data.map(
      record =>
        new AcademicSummary(
          record.total_attempted_credits,
          record.total_earned_credits,
          record.cumulative_gpa,
          record.percentile,
          record.attempted_credits_gpa
        )
    );
  }

  async getGpaDistribution(): Promise<
    Array<{
      range: { min: number; max: number };
      count: number;
    }>
  > {
    const { data, error } = await this.supabase
      .from('student_academic_records')
      .select('cumulative_gpa')
      .gt('cumulative_gpa', 0); // 유효한 GPA만 포함

    if (error) {
      throw new Error(`Failed to fetch GPA distribution: ${error.message}`);
    }

    // GPA 구간 정의 (0.5 단위)
    const ranges: Array<{ range: { min: number; max: number }; count: number }> = [];
    for (let i = 0; i <= 4.5; i += 0.5) {
      ranges.push({
        range: { min: i, max: i + 0.5 },
        count: 0,
      });
    }

    // 각 GPA를 해당하는 구간에 카운트
    data.forEach(record => {
      const gpa = record.cumulative_gpa;
      if (gpa === null) {return;}
      const range = ranges.find(r => gpa >= r.range.min && gpa < r.range.max);
      if (range) {
        range.count++;
      }
    });

    return ranges;
  }
}
