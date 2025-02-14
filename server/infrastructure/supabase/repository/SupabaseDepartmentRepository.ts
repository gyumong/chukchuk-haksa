import type { SupabaseClient } from '@supabase/supabase-js';
import { Department } from '@/server/domain/department/models/Department';
import type { IDepartmentRepository } from '@/server/domain/department/repositories/IDepartmentRepository';
import type { Database } from '@/types';
import { DepartmentMapper } from '../mappers/DepartmentMapper';

export class SupabaseDepartmentRepository implements IDepartmentRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  async findByCode(code: string): Promise<Department | null> {
    const { data, error } = await this.supabase
      .from('departments')
      .select('*')
      .eq('department_code', code)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return DepartmentMapper.toDomain(data);
  }

  async save(department: Department): Promise<Department> {
    const data = DepartmentMapper.toPersistence(department);

    const { data: saved, error } = await this.supabase
      .from('departments')
      .upsert(data, {
        onConflict: 'department_code',
        ignoreDuplicates: true,
      })
      .select()
      .single();

    if (error || !saved) {
      throw new DepartmentRepositoryError('Failed to save department');
    }

    const mappedDepartment = DepartmentMapper.toDomain(saved);
    if (!mappedDepartment) {
      throw new DepartmentRepositoryError('Invalid department data from database');
    }

    return mappedDepartment;
  }

  /**
   * getOrCreateDepartment
   * - 먼저 department_code로 학과를 조회하고, 있으면 해당 학과를 반환
   * - 없으면 새 학과를 생성하여 저장 후 반환
   */
  async getOrCreateDepartment(departmentData: { code: string; name: string }): Promise<Department> {
    // 1. department_code로 기존 학과 조회
    const existing = await this.findByCode(departmentData.code);
    if (existing) {
      // (선택사항) 이름이 다르다면 업데이트할 로직을 추가할 수 있음
      if (existing.getName() !== departmentData.name) {
        // 예: 로깅, 관리자 승인 또는 별도의 updateUseCase를 호출할 수 있음
      }
      return existing;
    }

    // 2. 학과가 없으면 새로 생성
    const newDepartment = Department.create(departmentData.code, departmentData.name);
    return await this.save(newDepartment);
  }
}

export class DepartmentRepositoryError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DepartmentRepositoryError';
  }
}
