import { Department } from '../models/Department';

export interface IDepartmentRepository {
  findByCode(code: string): Promise<Department | null>;
  save(department: Department): Promise<Department>;
  getOrCreateDepartment(departmentData: { code: string; name: string }): Promise<Department>;
}
