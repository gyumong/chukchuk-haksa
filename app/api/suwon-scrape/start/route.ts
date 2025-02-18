// app/api/suwon-scrape/start/route.ts
import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getIronSession } from 'iron-session';
import { v4 as uuidv4 } from 'uuid';
import type { SessionData } from '@/lib/auth';
import { sessionOptions } from '@/lib/auth';
import { setTask } from '@/lib/crawling/scrape-task';
import { createClient } from '@/lib/supabase/server';
import { SyncAcademicRecordUseCase } from '@/server/application/academic-record/usecases/SyncAcademicRecordUseCase';
import { InitializePortalConnectionUseCase } from '@/server/application/student/usecases/InitializePortalConnectionUseCase';
import { PortalRepositoryImpl } from '@/server/infrastructure/portal/PortalRepositoryImpl';
import { SupabaseAcademicRecordRepository } from '@/server/infrastructure/supabase/repository/SupabaseAcademicRecordRepository';
import { SupabaseCourseOfferingRepository } from '@/server/infrastructure/supabase/repository/SupabaseCourseOfferingRepository';
import { SupabaseCourseRepository } from '@/server/infrastructure/supabase/repository/SupabaseCourseRepository';
import { SupabaseDepartmentRepository } from '@/server/infrastructure/supabase/repository/SupabaseDepartmentRepository';
import { SupabaseProfessorRepository } from '@/server/infrastructure/supabase/repository/SupabaseProfessorRepository';
import { SupabaseStudentCourseRepository } from '@/server/infrastructure/supabase/repository/SupabaseStudentCourseRepository';
import { SupabaseUserRepository } from '@/server/infrastructure/supabase/repository/SupabaseUserRepository';
import { SupabaseAuthService } from '@/server/infrastructure/supabase/SupabaseAuthService';
import type { Database } from '@/types';

export async function POST(req: Request) {
  const timerLabel = `ColdStartTimer-${Date.now()}`;
  console.time(timerLabel);
  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);
  const username = session.username;
  const password = session.password;

  if (!username || !password) {
    return NextResponse.json({ error: '포털 로그인이 필요합니다.' }, { status: 401 });
  }
  let studentInfo;
  const taskId = uuidv4();
  setTask(taskId, 'in-progress', null);

  // 비동기로 크롤링 시작
  (async () => {
    try {
      const supabase: SupabaseClient<Database> = createClient();
      const portalRepository = new PortalRepositoryImpl();
      const departmentRepository = new SupabaseDepartmentRepository(supabase);
      const userRepository = new SupabaseUserRepository(supabase);
      const authService = new SupabaseAuthService(supabase);
      const courseRepository = new SupabaseCourseRepository(supabase);
      const professorRepository = new SupabaseProfessorRepository(supabase);
      const studentCourseRepository = new SupabaseStudentCourseRepository(supabase);
      const academicRecordRepository = new SupabaseAcademicRecordRepository(supabase);
      const courseOfferingRepository = new SupabaseCourseOfferingRepository(supabase);

      const portalData = await portalRepository.fetchPortalData(username, password);

      const initializePortalConnectionUseCase = new InitializePortalConnectionUseCase(
        portalRepository,
        departmentRepository,
        userRepository,
        authService
      );

      const syncAcademicRecordUseCase = new SyncAcademicRecordUseCase(
        portalRepository,
        authService,
        academicRecordRepository,
        studentCourseRepository,
        courseRepository,
        courseOfferingRepository,
        professorRepository
      );
      // (1) 포털 연동 초기화 유스케이스 실행
      const initResult = await initializePortalConnectionUseCase.executeWithPortalData(portalData);
      if (!initResult.isSuccess) {
        throw new Error(initResult.error);
      }

      // (2) 학업 이력 동기화 유스케이스 실행
      const syncResult = await syncAcademicRecordUseCase.executeWithPortalData(portalData);
      if (!syncResult.isSuccess) {
        throw new Error(syncResult.error);
      }

      studentInfo = initResult.studentInfo;

      console.timeEnd(timerLabel);
      setTask(taskId, 'completed', { message: '동기화 완료', studentInfo: initResult.studentInfo });
      // **세션 만료 처리**
      session.destroy(); // Iron Session에서 세션 데이터 삭제
      console.log('Session destroyed after successful scrape');
    } catch (err: any) {
      setTask(taskId, 'failed', { message: err.message });
    }
  })();

  return NextResponse.json({ taskId, studentInfo }, { status: 202 });
}
