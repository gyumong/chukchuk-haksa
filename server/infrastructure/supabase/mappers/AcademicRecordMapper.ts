// server/infrastructure/supabase/mappers/AcademicRecordMapper.ts
import { AcademicRecord } from '@/server/domain/academic-record/models/AcademicRecord';
import type { Database } from '@/types';

type SemesterRecord = Database['public']['Tables']['semester_academic_records']['Row'];
type StudentRecord = Database['public']['Tables']['student_academic_records']['Row'];

// DB -> Domain, Domain -> DB 매핑
export class InvalidDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidDataError';
  }
}

export class AcademicRecordMapper {
  static toDomain(studentId: string | null, semesterRecords: SemesterRecord[], summary: StudentRecord): AcademicRecord {
    if (!studentId) {
      throw new InvalidDataError('Student ID is required');
    }

    const validatedSemesters = semesterRecords.map(record => {
      if (!record.year) {
        throw new InvalidDataError('Year is required');
      }
      if (!record.semester) {
        throw new InvalidDataError('Semester is required');
      }
      if (record.attempted_credits === null) {
        throw new InvalidDataError('Attempted credits is required');
      }
      if (record.earned_credits === null) {
        throw new InvalidDataError('Earned credits is required');
      }
      if (record.semester_gpa === null) {
        throw new InvalidDataError('Semester GPA is required');
      }
      if (record.semester_percentile === null) {
        throw new InvalidDataError('Semester percentile is required');
      }
      if (record.attempted_credits_gpa === null) {
        throw new InvalidDataError('Attempted credits GPA is required');
      }

      return {
        year: record.year,
        semester: record.semester,
        attemptedCredits: record.attempted_credits,
        earnedCredits: record.earned_credits,
        semesterGpa: record.semester_gpa,
        semesterPercentile: record.semester_percentile,
        attemptedCreditsGpa: record.attempted_credits_gpa,
        classRank: record.class_rank,
        totalStudents: record.total_students,
      };
    });

    if (summary.total_attempted_credits === null) {
      throw new InvalidDataError('Total attempted credits is required');
    }
    if (summary.total_earned_credits === null) {
      throw new InvalidDataError('Total earned credits is required');
    }
    if (summary.cumulative_gpa === null) {
      throw new InvalidDataError('Cumulative GPA is required');
    }
    if (summary.percentile === null) {
      throw new InvalidDataError('Percentile is required');
    }
    if (summary.attempted_credits_gpa === null) {
      throw new InvalidDataError('Attempted credits GPA is required');
    }

    const validatedSummary = {
      totalAttemptedCredits: summary.total_attempted_credits,
      totalEarnedCredits: summary.total_earned_credits,
      cumulativeGpa: summary.cumulative_gpa,
      percentile: summary.percentile,
      attemptedCreditsGpa: summary.attempted_credits_gpa,
    };

    return AcademicRecord.create({
      studentId,
      semesters: validatedSemesters,
      total: validatedSummary,
      enrollments: [],
    });
  }

  static toPersistence(record: AcademicRecord): {
    semesterRecords: Array<Omit<SemesterRecord, 'id' | 'created_at' | 'updated_at'>>;
    summary: Omit<StudentRecord, 'id' | 'created_at' | 'updated_at'>;
  } {
    const studentId = record.getStudentId();
    if (!studentId) {
      throw new InvalidDataError('Student ID is required for persistence');
    }

    return {
      semesterRecords: record.getSemesters().map(semester => ({
        student_id: studentId,
        year: semester.getYear(),
        semester: semester.getSemester(),
        attempted_credits: semester.getAttemptedCredits(),
        earned_credits: semester.getEarnedCredits(),
        semester_gpa: semester.getSemesterGpa(),
        semester_percentile: semester.getSemesterPercentile(),
        attempted_credits_gpa: semester.getAttemptedCreditsGpa(),
        class_rank: semester.getClassRank(),
        total_students: semester.getTotalStudents(),
      })),
      summary: {
        student_id: studentId,
        total_attempted_credits: record.getSummary().getTotalAttemptedCredits(),
        total_earned_credits: record.getSummary().getTotalEarnedCredits(),
        cumulative_gpa: record.getSummary().getCumulativeGpa(),
        percentile: record.getSummary().getPercentile(),
        attempted_credits_gpa: record.getSummary().getAttemptedCreditsGpa(),
      },
    };
  }

  static validateStudentId(id: string | null): string {
    if (!id) {
      throw new InvalidDataError('Invalid student ID');
    }
    return id;
  }
}
