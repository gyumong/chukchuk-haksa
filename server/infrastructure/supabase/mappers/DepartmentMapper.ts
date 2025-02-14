import { Department } from '@/server/domain/department/models/Department';
import { Database } from '@/types';

type DatabaseDepartment = Database['public']['Tables']['departments']['Row'];
type InsertDepartment = Database['public']['Tables']['departments']['Insert'];

export class DepartmentMapper {
  static toDomain(dbDepartment: DatabaseDepartment): Department {
    if (!dbDepartment.department_code || !dbDepartment.established_department_name) {
      throw new DepartmentMappingError('Invalid department data from database');
    }

    return Department.reconstitute(
      dbDepartment.id,
      dbDepartment.department_code,
      dbDepartment.established_department_name
    );
  }

  static toPersistence(domain: Department): InsertDepartment {
    return {
      department_code: domain.getCode(),
      established_department_name: domain.getName(),
    };
  }
}

export class DepartmentMappingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DepartmentMappingError';
  }
}
