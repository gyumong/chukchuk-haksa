// server/infrastructure/supabase/repositories/SupabaseUserRepository.ts
import { SupabaseClient } from '@supabase/supabase-js';
import { StudentInitializationDataType } from '@/server/domain/student/repository/IStudentRepository';
import { User } from '@/server/domain/user/models/User';
import { IUserRepository } from '@/server/domain/user/repositories/IUserRepository';
import { UserMapper } from '../mappers/UserMapper';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select('id, portal_connected, connected_at, created_at, email, profile_image, profile_nickname, updated_at')
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return UserMapper.toDomain(data);
  }

  async delete(userId: string): Promise<void> {
    const { error } = await this.supabase.from('users').delete().eq('id', userId);

    if (error) {
      throw new Error('사용자 삭제 중 오류가 발생했습니다.');
    }
  }

  async initializePortalConnection(userId: string, studentData: StudentInitializationDataType): Promise<void> {
    console.log('initializePortalConnection', userId, studentData);
    const { error } = await this.supabase.rpc('initialize_portal_connection', {
      p_user_id: userId,
      p_student_data: {
        ...studentData,
        completedSemesters: parseInt(studentData.completedSemesters + '', 10), // 명시적으로 정수형 변환
        major_id: studentData.majorId,
        secondary_major_id: studentData.secondaryMajorId,
        department_id: studentData.departmentId,
      },
    });

    if (error) {
      throw new Error('포털 연동 초기화 중 오류가 발생했습니다.');
    }
  }
}
