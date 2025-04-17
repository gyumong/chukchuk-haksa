import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';
import { createClient } from '../server';

export class DepartmentService {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  static async create() {
    const supabase = await createClient();
    return new DepartmentService(supabase);
  }

  /**
   * department_code 컬럼으로 departments.id(PK) 조회
   */
  async getDepartmentByCode(departmentCode: string): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('departments')
      .select('id')
      .eq('department_code', departmentCode)
      .maybeSingle();

    if (error || !data) {
      console.error('Failed to get department by code:', error);
      return null;
    }

    return data.id;
  }

  /**
   * department_name으로 departments.id(PK) 조회
   */
  async getDepartmentByName(departmentName: string): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('departments')
      .select('id')
      .eq('department_name', departmentName)
      .maybeSingle();
    if (error || !data) {
      console.error('Failed to get department by name:', error);
      return null;
    }
    return data.id;
  }

  /**
   * departments 테이블에 새 레코드 생성 후 id(PK) 반환
   */
  async createDepartment(departmentCode: string, departmentName: string): Promise<number> {
    const { data, error } = await this.supabase
      .from('departments')
      .insert({
        department_code: departmentCode,
        established_department_name: departmentName,
      })
      .select('id')
      .single();

    if (error || !data) {
      console.error('Failed to create department.', error);
      throw new Error('Failed to create department.');
    }

    return data.id;
  }

  /**
   * department_code로 먼저 조회하고, 없으면 새로 insert
   */
  async getOrCreateDepartment(departmentCode: string, departmentName: string): Promise<number> {
    const existingId = await this.getDepartmentByCode(departmentCode);
    if (existingId) {
      return existingId;
    }

    return this.createDepartment(departmentCode, departmentName);
  }
}
