// server/infrastructure/supabase/repositories/SupabaseProfessorRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { Professor } from '@/server/domain/professor/models/Professor';
import type { IProfessorRepository } from '@/server/domain/professor/repositories/IProfessorRepository';
import { ProfessorMapper } from '@/server/infrastructure/supabase/mappers/ProfessorMapper';
import type { Database } from '@/types/supabase';

export class SupabaseProfessorRepository implements IProfessorRepository {
  constructor(private readonly supabase: SupabaseClient<Database>) {}

  static async create() {
    const supabase = await createClient();
    return new SupabaseProfessorRepository(supabase);
  }

  async findByName(professorName: string): Promise<Professor | null> {
    const { data, error } = await this.supabase
      .from('professor')
      .select('*')
      .eq('professor_name', professorName)
      .single();

    if (error || !data) {
      // 에러가 "No Rows Found"인 경우에는 null을 반환 (Supabase의 에러 코드에 따라 처리)
      return null;
    }
    return ProfessorMapper.toDomain(data);
  }

  async create(professor: Professor): Promise<Professor> {
    const payload = ProfessorMapper.toPersistence(professor);
    const { data, error } = await this.supabase.from('professor').insert(payload).select('*').single();

    if (error || !data) {
      console.error('Failed to create professor:', error);
      throw new Error('Failed to create professor');
    }
    return ProfessorMapper.toDomain(data);
  }

  async getOrCreate(professorName: string, departmentId?: number | null): Promise<Professor> {
    // 먼저 이름으로 교수 조회
    const existing = await this.findByName(professorName);
    if (existing) {
      return existing;
    }
    // 없으면 새로 생성
    const newProfessor = Professor.create({
      professorName,
      departmentId: departmentId ?? undefined,
    });
    return this.create(newProfessor);
  }
}
