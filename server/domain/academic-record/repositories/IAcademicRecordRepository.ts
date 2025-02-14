import { AcademicRecord } from '../models/AcademicRecord';

// server/domain/academic-record/repositories/IAcademicRecordRepository.ts
export interface IAcademicRecordRepository {
  /**
   * 학생의 학업 기록을 저장하거나 업데이트
   */
  upsertAcademicRecord(record: AcademicRecord): Promise<void>;

  /**
   * 학생 ID로 학업 기록 조회
   */
  findByStudentId(studentId: string): Promise<AcademicRecord | null>;

  /**
   * 특정 학기의 학업 기록 조회
   */
  findBySemester(studentId: string, year: number, semester: number): Promise<AcademicRecord | null>;
}
