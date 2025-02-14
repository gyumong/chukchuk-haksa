// server/infrastructure/supabase/mappers/UserMapper.ts
import { User } from '@/server/domain/user/models/User';
import { Database } from '@/types';

type DatabaseUser = Database['public']['Tables']['users']['Row'];

export class UserMapper {
  static toDomain(dbUser: DatabaseUser): User {
    if (!dbUser.id) {
      throw new Error('Invalid student data from database');
    }
    return User.reconstitute(
      dbUser.id,
      dbUser.portal_connected ?? false,
      dbUser.connected_at ? new Date(dbUser.connected_at) : null
    );
  }
}
