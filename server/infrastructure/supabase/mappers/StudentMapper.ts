// server/infrastructure/supabase/mappers/StudentMapper.ts
import { StudentStatusType } from '@/server/domain/student/models/AcademicInfo';
import { Student } from '@/server/domain/student/models/Student';
import { Database } from '@/types';

type DatabaseStudent = Database['public']['Tables']['students']['Row'];
type DatabaseStudentStatus = Database['public']['Enums']['student_status'];
type InsertStudent = Database['public']['Tables']['students']['Insert'];

export class StudentMapper {
  static toDomain(dbStudent: DatabaseStudent): Student {
    if (!dbStudent.student_code || !dbStudent.name || !dbStudent.department_id) {
      throw new StudentMappingError('Invalid student data from database');
    }

    return Student.reconstitute({
      id: dbStudent.student_id,
      userId: dbStudent.student_id,
      code: dbStudent.student_code,
      name: dbStudent.name,
      departmentId: dbStudent.department_id,
      majorId: dbStudent.major_id ?? dbStudent.department_id, // 기본적으로 department_id와 동일
      secondaryMajorId: dbStudent.secondary_major_id ?? null,
      targetGpa: dbStudent.target_gpa ?? null,
      academic: {
        admissionYear: dbStudent.admission_year,
        semester: dbStudent.semester_enrolled ?? 1,
        isTransfer: dbStudent.is_transfer_student ?? false,
        status: dbStudent.status ?? ('재학' as StudentStatusType),
        gradeLevel: dbStudent.grade_level ?? 1,
        completedSemesters: dbStudent.completed_semesters ?? 0,
      },
    });
  }

  static toPersistence(domain: Student): InsertStudent {
    const academic = domain.getAcademicInfo();
    const studentId = domain.getId()?.getValue();

    if (!studentId) {
      throw new StudentMappingError('Student ID is required for persistence');
    }

    return {
      student_id: studentId,
      student_code: domain.getCode(),
      name: domain.getName(),
      department_id: domain.getDepartmentId(),
      major_id: domain.getMajorId(),
      secondary_major_id: domain.getSecondaryMajorId(),
      admission_year: academic.getAdmissionYear(),
      semester_enrolled: academic.getSemester(),
      is_transfer_student: academic.getIsTransfer(),
      status: academic.getStatus() as DatabaseStudentStatus,
      grade_level: academic.getGradeLevel(),
      completed_semesters: academic.getCompletedSemesters(),
      target_gpa: domain.getTargetGpa() ?? null,
    };
  }
}

export class StudentMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'StudentMappingError';
  }
}
