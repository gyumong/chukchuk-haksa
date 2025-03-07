// server/infrastructure/supabase/repositories/SupabaseUserRepository.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { StudentInitializationDataType } from '@/server/domain/student/repository/IStudentRepository';
import type { User } from '@/server/domain/user/models/User';
import type { IUserRepository } from '@/server/domain/user/repositories/IUserRepository';
import { UserMapper } from '../mappers/UserMapper';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findById(id: string): Promise<User | null> {
    const { data, error } = await this.supabase
      .from('users')
      .select(
        'id, portal_connected, connected_at, last_synced_at, created_at, email, profile_image, profile_nickname, updated_at, deleted_at, is_deleted'
      )
      .eq('id', id)
      .single();

    if (error || !data) {
      return null;
    }

    return UserMapper.toDomain(data);
  }

  async initializePortalConnection(userId: string, studentData: StudentInitializationDataType): Promise<void> {
    console.log('initializePortalConnection', userId, studentData);
    const { error } = await this.supabase.rpc('initialize_portal_connection', {
      p_user_id: userId,
      p_student_data: {
        ...studentData,
        completedSemesters: parseInt(String(studentData.completedSemesters), 10), // 명시적으로 정수형 변환
        major_id: studentData.majorId,
        secondary_major_id: studentData.secondaryMajorId,
        department_id: studentData.departmentId,
      },
    });

    if (error) {
      console.log('error', error);
      throw new Error('포털 연동 초기화 중 오류가 발생했습니다.');
    }
  }

  async refreshPortalConnection(userId: string, studentData: StudentInitializationDataType): Promise<void> {
    const { error } = await this.supabase.rpc('refresh_portal_connection', {
      p_user_id: userId,
      p_student_data: {
        ...studentData,
        completedSemesters: parseInt(String(studentData.completedSemesters), 10),
        major_id: studentData.majorId,
        secondary_major_id: studentData.secondaryMajorId,
        department_id: studentData.departmentId,
      },
    });

    if (error) {
      console.log('error', error);
      throw new Error('포털 재동기화 중 오류가 발생했습니다.');
    }
  }

  async delete(userId: string): Promise<void> {
    // Instead of physical delete(), do "soft delete"
    const { error } = await this.supabase
      .from('users')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      throw new Error(`사용자 소프트 삭제 중 오류가 발생했습니다: ${error.message}`);
    }
  }
}
