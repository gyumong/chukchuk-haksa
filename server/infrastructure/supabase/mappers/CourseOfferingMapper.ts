// server/infrastructure/supabase/mappers/CourseOfferingMapper.ts
import type { CourseAreaType, EvaluationType } from '@/server/domain/course-offering/models/CourseOffering';
import { CourseOffering } from '@/server/domain/course-offering/models/CourseOffering';
import type { Database } from '@/types/supabase';

type DBCourseOfferingRecord = Database['public']['Tables']['course_offerings']['Row'];
type DBCourseOfferingInsert = Database['public']['Tables']['course_offerings']['Insert'];

export class CourseOfferingMapper {
  /**
   * 데이터베이스 레코드를 도메인 모델로 변환합니다.
   */
  static toDomain(record: DBCourseOfferingRecord): CourseOffering {
    return CourseOffering.reconstitute({
      id: record.id,
      courseId: record.course_id,
      year: record.year,
      semester: record.semester,
      classSection: record.class_section ?? undefined,
      professorId:
        record.professor_id ??
        (() => {
          throw new Error('Professor ID is required');
        })(),
      departmentId: record.department_id ?? undefined,
      scheduleSummary: record.schedule_summary ?? undefined,
      evaluationType: record.evaluation_type_code as EvaluationType | undefined,
      isVideoLecture: record.is_video_lecture ?? false,
      subjectEstablishmentSemester: record.subject_establishment_semester ?? undefined,
      facultyDivisionName: record.faculty_division_name as CourseAreaType | undefined,
      areaCode: record.area_code ?? undefined,
      originalAreaCode: record.original_area_code ?? undefined,
      points: record.points ?? undefined,
      hostDepartment: record.host_department ?? undefined,
    });
  }

  /**
   * 도메인 모델을 데이터베이스 인서트용 객체로 변환합니다.
   */
  static toPersistence(offering: CourseOffering): DBCourseOfferingInsert {
    return {
      course_id: offering.getCourseId(),
      year: offering.getYear(),
      semester: offering.getSemester(),
      class_section: offering.getClassSection(),
      professor_id: offering.getProfessorId(),
      department_id: offering.getDepartmentId(),
      schedule_summary: offering.getScheduleSummary(),
      evaluation_type_code: offering.getEvaluationType(),
      is_video_lecture: offering.getIsVideoLecture(),
      subject_establishment_semester: offering.getSubjectEstablishmentSemester(),
      faculty_division_name: offering.getFacultyDivisionName(),
      area_code: offering.getAreaCode(),
      original_area_code: offering.getOriginalAreaCode(),
      points: offering.getPoints(),
      host_department: offering.getHostDepartment(),
    };
  }
}
