import type { SemesterGrade } from '../models/SemesterGrade';

// server/domain/academic-record/repositories/ISemesterGradeRepository.ts
export interface ISemesterGradeRepository {
  /**
   * 학기별 성적 저장/업데이트
   */
  upsertSemesterGrades(studentId: string, grades: SemesterGrade[]): Promise<void>;

  /**
   * 학생의 모든 학기 성적 조회
   */
  findByStudentId(studentId: string): Promise<SemesterGrade[]>;

  /**
   * 특정 학기 성적 조회
   */
  findBySemester(studentId: string, year: number, semester: number): Promise<SemesterGrade | null>;

  /**
   * 특정 학기의 전체 학생 성적 통계 조회
   */
  getSemesterStatistics(
    year: number,
    semester: number
  ): Promise<{
    averageGpa: number;
    medianGpa: number;
    totalStudents: number;
  }>;
}
