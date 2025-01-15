import { NextResponse } from 'next/server';
import { StudentService } from '@/lib/supabase/services/student-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const targetGpa = parseFloat(body.targetGpa);

    // 유효성 검사
    if (isNaN(targetGpa) || targetGpa < 0 || targetGpa > 4.5) {
      return NextResponse.json({ error: '유효하지 않은 목표 학점입니다.' }, { status: 400 });
    }

    const studentService = new StudentService();
    await studentService.updateTargetGpa(targetGpa);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Target score update failed:', error);
    return NextResponse.json({ error: '목표 학점 설정에 실패했습니다.' }, { status: 500 });
  }
}
