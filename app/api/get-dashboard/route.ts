import { NextResponse } from 'next/server';
import { DashboardFacade } from '@/lib/supabase/facades/dashboard-facade';
import { SupabaseUserRepository } from '@/server/infrastructure/supabase/repository/SupabaseUserRepository';
import { SupabaseAuthService } from '@/server/infrastructure/supabase/SupabaseAuthService';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/server';
import type { Database } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase: SupabaseClient<Database> = createClient();
    const userRepository = new SupabaseUserRepository(supabase);
    const authService = new SupabaseAuthService(supabase);
    const dashboardFacade = new DashboardFacade(
      userRepository,
      authService
    );
    const dashboard = await dashboardFacade.getDashboard();

    return NextResponse.json(dashboard);
  } catch (error: any) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ error: '대시보드 데이터 조회에 실패했습니다.' }, { status: 500 });
  }
}
