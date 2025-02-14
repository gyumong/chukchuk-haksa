// server/infrastructure/supabase/mappers/StudentCourseMapper.ts
import { CourseEnrollment } from '@/server/domain/academic-record/models/CourseEnrollment';
import { Database } from '@/types/supabase';
import { GradeMapper } from './GradeMapper';

type StudentCourseRecord = Database['public']['Tables']['student_courses']['Row'];
type StudentCourseInsert = Database['public']['Tables']['student_courses']['Insert'];

export class StudentCourseMapper {
  /**
   * 도메인 모델을 데이터베이스 레코드로 변환
   */
  static toRecord(enrollment: CourseEnrollment): StudentCourseInsert {
    return {
      student_id: enrollment.getStudentId(),
      offering_id: enrollment.getOfferingId(),
      grade: GradeMapper.toPersistence(enrollment.getGrade()),
      is_retake: enrollment.isRetake(),
      original_score: enrollment.getOriginalScore(),
      points: enrollment.getPoints(),
    };
  }

  /**
   * 데이터베이스 레코드를 도메인 모델로 변환
   */
  static toDomain(record: StudentCourseRecord): CourseEnrollment {
    return CourseEnrollment.create({
      studentId: record.student_id,
      offeringId: record.offering_id,
      grade: GradeMapper.toDomain(record.grade),
      points: record.points ?? 0,
      isRetake: record.is_retake,
      originalScore: record.original_score,
    });
  }

  /**
   * 여러 데이터베이스 레코드를 도메인 모델로 변환
   */
  static toDomainList(records: StudentCourseRecord[]): CourseEnrollment[] {
    return records.map(record => this.toDomain(record));
  }
}
