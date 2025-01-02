import { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../server';
import { DepartmentService } from './department-service';
import type { Student } from '@/types';

export class StudentService {
  private readonly departmentService: DepartmentService;

  constructor(
    private readonly supabase: SupabaseClient = createClient(),
    departmentService?: DepartmentService
  ) {
    this.departmentService = departmentService || new DepartmentService(supabase);
  }

  private async getAuthenticatedUserId(): Promise<string> {
    const { data: userData, error } = await this.supabase.auth.getUser();

    if (error || !userData?.user) {
      throw new Error('User is not authenticated');
    }

    const userId = userData.user.id;

    if (!userId) {
      throw new Error('User is not authenticated');
    }

    return userId;
  }

  async initializeStudent(student: Student): Promise<string> {
    const userId = await this.getAuthenticatedUserId();

    // 학과 및 전공 정보 처리
    const departmentId = await this.departmentService.getOrCreateDepartment(
      student.departmentId,
      student.departmentName
    );

    const majorId = await this.departmentService.getOrCreateDepartment(
      student.majorId,
      student.majorName
    );

    const secondaryMajorId = student.secondaryMajorId && student.secondaryMajorName
      ? await this.departmentService.getOrCreateDepartment(
          student.secondaryMajorId,
          student.secondaryMajorName
        )
      : null;

    // 학생 정보 저장
    const { data: studentData, error: studentError } = await this.supabase
      .from('students')
      .upsert(
        {
          student_id: userId,
          portal_username: student.portalUsername,
          name: student.name,
          department_id: departmentId,
          major_id: majorId,
          secondary_major_id: secondaryMajorId,
          admission_year: student.admissionYear,
          semester_enrolled: student.semesterEnrolled,
          is_transfer_student: student.isTransferStudent,
          is_graduated: student.isGraduated,
          status: student.status,
          grade_level: student.gradeLevel,
          admission_type: student.admissionType,
        },
        { onConflict: 'student_id' }
      )
      .select('student_id')
      .single();

    if (studentError || !studentData) {
      console.error('Failed to initialize student record.', studentError);
      throw new Error('Failed to initialize student record.');
    }

    return studentData.student_id;
  }
}
