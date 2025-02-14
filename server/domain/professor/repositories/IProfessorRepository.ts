// server/domain/professor/repositories/IProfessorRepository.ts
import { Professor } from '@/server/domain/professor/models/Professor';

export interface IProfessorRepository {
  /**
   * 교수 이름으로 조회
   * @param professorName - 교수 이름
   * @returns 해당 이름의 교수 도메인 객체 또는 null
   */
  findByName(professorName: string): Promise<Professor | null>;

  /**
   * 새로운 교수 도메인 객체를 생성하여 저장
   * @param professor - 생성할 교수 도메인 객체
   * @returns 저장된 교수 도메인 객체
   */
  create(professor: Professor): Promise<Professor>;

  /**
   * 교수 이름(및 선택적으로 학과 ID)을 기반으로 조회하고, 없으면 새로 생성하여 반환
   * @param professorName - 교수 이름
   * @param departmentId - 해당 교수의 학과 ID (선택적)
   * @returns 해당 교수 도메인 객체
   */
  getOrCreate(professorName: string, departmentId?: number | null): Promise<Professor>;
}
