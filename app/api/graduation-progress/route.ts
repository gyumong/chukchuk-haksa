import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GraduationProgressService } from '@/lib/supabase/services/graduation-progress-service';

export async function GET() {
  try {
    const supabase = createClient();
    const service = new GraduationProgressService(supabase);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 학생 정보 조회
    const { data: student } = await supabase.from('students').select('*').eq('student_id', user.id).single();

    if (!student) {
      return NextResponse.json({ error: '학생 정보를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 영역별 이수현황 조회
    const areaProgress = await service.getStudentAreaProgress(user.id, student.department_id, student.admission_year);

    // 졸업요건 진척도 업데이트
    await service.updateGraduationProgress();

    return NextResponse.json({ areaProgress });
  } catch (error) {
    console.error('Failed to get graduation progress:', error);
    return NextResponse.json({ error: '졸업요건 조회에 실패했습니다.' }, { status: 500 });
  }
}
