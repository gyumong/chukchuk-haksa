// app/api/users/[userId]/route.ts
import { NextResponse } from 'next/server';
import { type SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import { DeleteUserUseCase } from '@/server/application/user/usecases/DeleteUserUseCase';
import { SupabaseUserRepository } from '@/server/infrastructure/supabase/repository/SupabaseUserRepository';
import type { Database } from '@/types';

export async function DELETE() {
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    const userRepository = new SupabaseUserRepository(supabase);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository);

    // 인증된 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    const result = await deleteUserUseCase.execute(user.id);
    if (!result.isSuccess) {
      throw new Error(result.error);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
