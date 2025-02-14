import type { AcademicSummary } from '../models/AcademicSummary';

// server/domain/academic-record/repositories/IAcademicSummaryRepository.ts
export interface IAcademicSummaryRepository {
  /**
   * 학업 요약 정보 저장/업데이트
   */
  upsertSummary(studentId: string, summary: AcademicSummary): Promise<void>;

  /**
   * 학생의 학업 요약 정보 조회
   */
  findByStudentId(studentId: string): Promise<AcademicSummary | null>;

  /**
   * 여러 학생들의 학업 요약 정보 조회
   */
  findByStudentIds(studentIds: string[]): Promise<AcademicSummary[]>;

  /**
   * 전체 학생 성적 분포 조회
   */
  getGpaDistribution(): Promise<
    Array<{
      range: { min: number; max: number };
      count: number;
    }>
  >;
}
