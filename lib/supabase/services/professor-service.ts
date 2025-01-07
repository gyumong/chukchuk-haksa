import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types';
import { createClient } from '../server';

export class ProfessorService {
  constructor(private readonly supabase: SupabaseClient<Database> = createClient()) {}

  /**
   * 이름으로 교수 조회 또는 생성
   * - 교수 이름으로 `professor` 테이블을 검색
   * - 없으면 새로 생성 (professor_code는 null로)
   * @param professorName 교수 이름
   * @param departmentId 해당 교수의 학과 ID (선택적)
   * @returns professor의 ID
   */
  async getOrCreateProfessorByName(professorName: string, departmentId?: number | null): Promise<number> {
    // 1. 교수 이름으로 조회
    const { data: existingProfessor, error: fetchError } = await this.supabase
      .from('professor')
      .select('id')
      .eq('professor_name', professorName)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // "PGRST116"은 No Rows Found 에러를 의미
      console.error('Failed to fetch professor by name:', fetchError);
      throw new Error('Failed to fetch professor');
    }

    // 2. 이미 존재하면 해당 교수의 ID 반환
    if (existingProfessor) {
      return existingProfessor.id;
    }

    // 3. 존재하지 않으면 새로 생성
    const { data: newProfessor, error: insertError } = await this.supabase
      .from('professor')
      .insert({
        professor_name: professorName,
        professor_code: null, // 초기 생성 시 코드가 없으므로 null로 처리
        department_id: departmentId || null, // 학과 정보도 선택적으로 추가
      })
      .select('id')
      .single();

    if (insertError || !newProfessor) {
      console.error('Failed to create professor:', insertError);
      throw new Error('Failed to create professor');
    }

    return newProfessor.id;
  }
}
