// server/infrastructure/supabase/mappers/ProfessorMapper.ts
import { Professor } from '@/server/domain/professor/models/Professor';
import type { Database } from '@/types/supabase';

type DatabaseProfessor = Database['public']['Tables']['professor']['Row'];
type InsertProfessor = Database['public']['Tables']['professor']['Insert'];

export class ProfessorMapper {
  /**
   * 데이터베이스 레코드를 도메인 모델로 변환
   * @param record - Supabase에서 조회한 교수 레코드
   * @returns 도메인 Professor 객체
   */
  static toDomain(record: DatabaseProfessor): Professor {
    return Professor.reconstitute({
      id: record.id,
      professorName: record.professor_name,
      professorCode: record.professor_code ?? undefined,
      departmentId: record.department_id ?? undefined,
    });
  }

  /**
   * 도메인 모델을 데이터베이스 저장용 객체로 변환
   * @param professor - 도메인 Professor 객체
   * @returns Supabase Insert 객체
   */
  static toPersistence(professor: Professor): InsertProfessor {
    return {
      professor_name: professor.getProfessorName(),
      professor_code: professor.getProfessorCode(),
      department_id: professor.getDepartmentId(),
    };
  }
}
