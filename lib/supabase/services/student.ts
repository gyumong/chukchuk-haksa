import type { Student } from '@/types';
import { createClient } from '../server';

/** 학생 초기화 로직 */
export async function initializeStudent(student: Student): Promise<string> {
  const supabase = createClient();

  const { data: userData, error } = await supabase.auth.getUser();

  if (error || !userData?.user) {
    throw new Error('User is not authenticated');
  }

  const userId = userData.user.id;

  if (!userId) {
    throw new Error('User is not authenticated');
  }

  // 학과 및 주/복수전공 ID 확인 또는 생성
  const departmentId = await getOrCreateDepartment(student.departmentId, student.departmentName);
  const majorId = await getOrCreateDepartment(student.majorId ,student.majorName);
  const secondaryMajorId = student.secondaryMajorName 
  && student.secondaryMajorId
    ? await getOrCreateDepartment(student.secondaryMajorId,student.secondaryMajorName)
    : null;


  // students 테이블 데이터 삽입/업데이트
  const { data: studentData, error: studentError } = await supabase
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

  return studentData.student_id; // 학생 ID 반환
}

/** 학과 ID 확인 또는 생성 */
async function getOrCreateDepartment(departmentCode: number, departmentName: string): Promise<number> {
  const supabase = createClient();

    // 학과 코드 기준으로 확인
    const { data, error } = await supabase
        .from('departments')
        .select('id')
        .eq('department_code', departmentCode) // department_code로 확인
        .single();

  if (error || !data) {
      // 학과가 없으면 생성
      const { data: newDepartment, error: createError } = await supabase
          .from('departments')
          .insert({
              department_code: departmentCode, // 학과 코드 추가
              established_department_name: departmentName, // 학과 이름 추가
          })
          .select('id')
          .single();

      if (createError || !newDepartment) {
          console.error('Failed to create department.', createError);
          throw new Error('Failed to create department.');
      }

      return newDepartment.id; // 새로 생성된 ID 반환
  }

  return data.id; // 기존 학과 ID 반환
}
