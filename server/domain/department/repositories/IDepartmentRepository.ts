import type { Department } from '../models/Department';

interface DepartmentCreationData {
  code: string;
  name: string;
}

export interface IDepartmentRepository {
  findByCode(code: string): Promise<Department | null>;
  save(department: Department): Promise<Department>;
  getOrCreateDepartment(departmentData: DepartmentCreationData): Promise<Department>;
}
