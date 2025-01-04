import type { SupabaseClient } from '@supabase/supabase-js';
import type { Student } from '@/types/domain';
import type { Database } from '@/types/supabase';
import { createClient } from '../server';
import { DepartmentService } from './department-service';

export class StudentService {
  private readonly departmentService: DepartmentService;

  constructor(
    private readonly supabase: SupabaseClient<Database> = createClient(),
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

  /**
   * 학생 정보를 초기화(Upsert)하고, student_id(= userId)를 반환
   */
  async initializeStudent(student: Student): Promise<string> {
    const userId = await this.getAuthenticatedUserId();

    // 1) 학과 department_id(FK) 설정
    const departmentPk = await this.departmentService.getOrCreateDepartment(
      student.departmentCode, // 크롤링된 학과 코드
      student.departmentName
    );

    // 2) 주전공 major_id(FK) 설정
    const majorPk = await this.departmentService.getOrCreateDepartment(
      student.majorCode, // 크롤링된 전공 코드
      student.majorName
    );

    // 3) 복수전공 secondary_major_id(FK) 설정 (선택사항)
    let secondaryMajorPk: number | null = null;
    if (student.secondaryMajorCode && student.secondaryMajorName) {
      secondaryMajorPk = await this.departmentService.getOrCreateDepartment(
        student.secondaryMajorCode,
        student.secondaryMajorName
      );
    }

    const { data: studentData, error: studentError } = await this.supabase
      .from('students')
      .upsert({
        student_id: userId,
        student_code: student.studentCode,
        name: student.name,
        department_id: departmentPk,
        major_id: majorPk,
        secondary_major_id: secondaryMajorPk,
        admission_year: student.admissionYear,
        semester_enrolled: student.semesterEnrolled,
        is_transfer_student: student.isTransferStudent,
        is_graduated: student.isGraduated,
        status: student.status,
        grade_level: student.gradeLevel,
        admission_type: student.admissionType,
      })
      .select('student_id')
      .single();

    if (studentError || !studentData) {
      console.error('Failed to initialize student record.', studentError);
      throw new Error('Failed to initialize student record.');
    }

    return studentData.student_id;
  }
}
