import type { SupabaseClient } from '@supabase/supabase-js';
import type { Student } from '@/server/domain/student/models/Student';
import type { IStudentRepository } from '@/server/domain/student/repository/IStudentRepository';
import type { Database } from '@/types';
import { StudentMapper } from '../mappers/StudentMapper';

export class SupabaseStudentRepository implements IStudentRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async save(student: Student): Promise<Student> {
    const data = StudentMapper.toPersistence(student);

    const { data: saved, error } = await this.supabase
      .from('students')
      .upsert(data)
      .select(
        `
          *,
          departments!inner (
            id,
            department_code,
            established_department_name
          )
        `
      )
      .single();

    if (error || !saved) {
      throw new Error('Failed to save student');
    }

    return StudentMapper.toDomain(saved);
  }

  async findById(id: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from('students')
      .select(
        `
          *,
          departments!inner (
            id,
            department_code,
            established_department_name
          )
        `
      )
      .eq('student_id', id)
      .single();

    if (error || !data) {return null;}

    return StudentMapper.toDomain(data);
  }

  async findByMajorId(majorId: number): Promise<Student[]> {
    const { data, error } = await this.supabase
      .from('students')
      .select(
        `
          *,
          departments!inner (
            id,
            department_code,
            established_department_name
          )
        `
      )
      .eq('major_id', majorId);

    if (error || !data) {return [];}

    return data.map(student => StudentMapper.toDomain(student));
  }

  async findByCode(code: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from('students')
      .select(
        `
          *,
          departments!inner (
            id,
            department_code,
            established_department_name
          )
        `
      )
      .eq('student_code', code)
      .single();

    if (error || !data) {return null;}

    return StudentMapper.toDomain(data);
  }

  async findByStudentCode(studentCode: string): Promise<Student | null> {
    const { data, error } = await this.supabase
      .from('students')
      .select(
        `
            *,
            departments!inner (
              id,
              department_code,
              established_department_name
            )
          `
      )
      .eq('student_code', studentCode)
      .single();

    if (error || !data) {return null;}

    return StudentMapper.toDomain(data);
  }

  async findByDepartmentId(departmentId: number): Promise<Student[]> {
    const { data, error } = await this.supabase
      .from('students')
      .select(
        `
            *,
            departments!inner (
              id,
              department_code,
              established_department_name
            )
          `
      )
      .eq('department_id', departmentId);

    if (error || !data) {return [];}

    return data
      .map(student => StudentMapper.toDomain(student))
      .filter((student): student is Student => student !== null);
  }
  async update(student: Student): Promise<void> {
    const studentId = student.getId()?.getValue();

    if (!studentId) {
      throw new Error('Student ID is required for update');
    }

    const data = StudentMapper.toPersistence(student);
    const { error } = await this.supabase.from('students').update(data).eq('student_id', studentId);

    if (error) {
      throw new Error(`Failed to update student: ${error.message}`);
    }
  }

  async updateTargetGpa(studentId: string, targetGpa: number): Promise<void> {
    const { error } = await this.supabase
      .from('students')
      .update({ target_gpa: targetGpa })
      .eq('student_id', studentId);

    if (error) {
      throw new Error(`Failed to update target GPA: ${error.message}`);
    }
  }

  async delete(studentId: string): Promise<void> {
    const { error } = await this.supabase.from('students').delete().eq('student_id', studentId);

    if (error) {
      throw new Error(`Failed to delete student: ${error.message}`);
    }
  }

  async exists(studentId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('students')
      .select('student_id')
      .eq('student_id', studentId)
      .single();

    if (error) {return false;}
    return Boolean(data);
  }
}
