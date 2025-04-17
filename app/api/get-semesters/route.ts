import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();

    // 인증된 사용자 확인
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 사용자의 모든 학기 성적 정보 조회 (중복 제거하여 년도와 학기만)
    const { data: semesters, error } = await supabase
      .from('semester_academic_records')
      .select('year, semester')
      .eq('student_id', user.id)
      .order('year', { ascending: false })
      .order('semester', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(semesters);
  } catch (error) {
    console.error('Failed to fetch semesters:', error);
    return NextResponse.json({ error: '학기 정보 조회에 실패했습니다.' }, { status: 500 });
  }
}
