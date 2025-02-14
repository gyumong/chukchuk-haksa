import { SupabaseClient } from '@supabase/supabase-js';
import { IAuthService } from '@/server/domain/auth/IAuthService';

export class SupabaseAuthService implements IAuthService {
  constructor(private readonly supabase: SupabaseClient) {}

  async getAuthenticatedUserId(): Promise<string> {
    const { data: userData, error } = await this.supabase.auth.getUser();

    if (error || !userData?.user) {
      throw new Error('User is not authenticated');
    }

    const userId = userData.user.id;

    if (!userId) {
      throw new Error('User is not authenticated');
    }

    return userId;
  }
}
