import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '../server';

export class DepartmentService {
  constructor(private readonly supabase: SupabaseClient = createClient()) {}

  async getDepartmentById(departmentCode: number): Promise<number | null> {
    const { data, error } = await this.supabase
      .from('departments')
      .select('id')
      .eq('department_code', departmentCode)
      .single();

    if (error) {
      console.error('Failed to get department.', error);
      return null;
    }

    return data?.id ?? null;
  }

  async createDepartment(departmentCode: number, departmentName: string): Promise<number> {
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

  async getOrCreateDepartment(departmentCode: number, departmentName: string): Promise<number> {
    const existingId = await this.getDepartmentById(departmentCode);
    if (existingId) {
      return existingId;
    }

    return this.createDepartment(departmentCode, departmentName);
  }
}
