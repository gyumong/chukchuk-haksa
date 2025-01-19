export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { DashboardFacade } from '@/lib/supabase/facades/dashboard-facade';

export async function GET() {
  try {
    const dashboardFacade = new DashboardFacade();
    const dashboard = await dashboardFacade.getDashboard();

    return NextResponse.json(dashboard);
  } catch (error: any) {
    console.error('Dashboard fetch error:', error);
    return NextResponse.json({ error: '대시보드 데이터 조회에 실패했습니다.' }, { status: 500 });
  }
}
