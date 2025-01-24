import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { AcademicRecordService } from '@/lib/supabase/services/academic-record-service';
import { GraduationProgressService } from '@/lib/supabase/services/graduation-progress-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient();
    const graduationService = new GraduationProgressService(supabase);
    const academicService = new AcademicRecordService(supabase);

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

    // 병렬로 모든 데이터 조회
    const [areaProgress, academicSummary, semesterGrades] = await Promise.all([
      // 영역별 이수현황 조회
      graduationService.getStudentAreaProgress(user.id, student.department_id, student.admission_year),
      // 학업 성적 요약 정보 조회
      academicService.getAcademicSummary(),
      // 학기별 성적 정보 조회
      academicService.getSemesterGrades(),
    ]);

    return NextResponse.json({
      academicSummary,
      semesterGrades,
      graduationProgress: areaProgress,
    });
  } catch (error) {
    console.error('Failed to get graduation progress:', error);
    return NextResponse.json({ error: '졸업요건 조회에 실패했습니다.' }, { status: 500 });
  }
}
