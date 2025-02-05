// app/api/suwon-scrape/start/route.ts
import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { v4 as uuidv4 } from 'uuid';
import type { SessionData } from '@/lib/auth';
import { sessionOptions } from '@/lib/auth';
import { setTask } from '@/lib/crawling/scrape-task';
import {
  mapGradeResponseDTOToDomain,
  mapMergedSemesterDTOToDomain,
  mapStudentDTOToDomain,
} from '@/lib/crawling/suwon-dto';
import { scrapeSuwonAll } from '@/lib/crawling/suwon-scrape-all';
import { AcademicRecordService } from '@/lib/supabase/services/academic-record-service';
import { CourseOfferingService } from '@/lib/supabase/services/course-offering-service';
import { CourseService } from '@/lib/supabase/services/course-service';
import { ProfessorService } from '@/lib/supabase/services/professor-service';
import { StudentCourseService } from '@/lib/supabase/services/student-course-service';
import { StudentService } from '@/lib/supabase/services/student-service';
import type { AcademicRecords, Database, MergedSemester, Student } from '@/types';

export async function POST(req: Request) {
  function parseSemesterString(semStr: string): { year: number; semester: number } {
    const parts = semStr.split('-');
    if (parts.length !== 2) {
      return { year: 2023, semester: 10 };
    }
    const year = parseInt(parts[0], 10) || 2023;
    const semester = parseInt(parts[1], 10) || 10;
    return { year, semester };
  }

  const res = NextResponse.next();
  const session = await getIronSession<SessionData>(req, res, sessionOptions);

  const username = session.username;
  const password = session.password;

  if (!username || !password) {
    return NextResponse.json({ error: '포털 로그인이 필요합니다.' }, { status: 401 });
  }

  const taskId = uuidv4();
  setTask(taskId, 'in-progress', null);

  // 비동기로 크롤링 시작
  (async () => {
    try {
      const response = await scrapeSuwonAll(username, password);
      const { student: studentDTO, semesters: mergedDataDTO, academicRecords: academicRecordsDTO } = response;

      const student: Student = mapStudentDTOToDomain(studentDTO);
      const mergedData: MergedSemester[] = mapMergedSemesterDTOToDomain(mergedDataDTO);
      // 1) 학생 정보 초기화
      const studentService = new StudentService();
      const studentId = await studentService.initializeStudent(student);

      // console.log('studentId', studentId);

      // // 2) 필요한 다른 서비스들
      const courseService = new CourseService();
      const offeringService = new CourseOfferingService();
      const professorService = new ProfessorService();
      const studentCourseService = new StudentCourseService();
      const academicRecordService = new AcademicRecordService();

      // // 3) 성적 정보 저장

      const academicRecords: AcademicRecords = mapGradeResponseDTOToDomain(academicRecordsDTO);
      await academicRecordService.upsertAcademicRecords(studentId, academicRecords);

      // // 4) student_courses upsert 준비
      const studentCoursesToUpsert = [];

      for (const semesterBlock of mergedData) {
        //   // 예: semesterBlock.semester = "2024-20"
        const { year, semester } = parseSemesterString(semesterBlock.semester);

        for (const c of semesterBlock.courses) {
          //     // 학과 ID
          //     // 우선 학과 아이디를 수집할 수 없음, 크롤링상에서 학과명만 수집가능한데 학과명은 단과대마다 중복 생성이 가능하여 중복적으로 생성된 상황
          // const departmentService = new DepartmentService();
          //     // 따라서 우선은 개설학과명 자체를 저장시키고 차후에 정책이 수립되면 학과 아이디를 수집하도록 함
          // const departmentName = c.departmentName || '미확인학과';
          // const departmentId = await departmentService.getDepartmentByName(departmentName);

          //     // 교수 ID
          const professorName = c.professorName || '미확인교수';
          const professorId = await professorService.getOrCreateProfessorByName(professorName);

          //     // 과목 ID
          //     // courseCode가 없으면 subjectCode, departmentName 등 대안이 필요.
          //     // 여기서는 courseCode나 subjectCode 중 하나가 있다고 가정
          const code = c.courseCode || c.subjectCode || 'UNKNOWN_CODE';
          const courseId = await courseService.getOrCreateCourse(code, {
            courseCode: code,
            courseName: c.courseName || '제목없음',
            points: c.points || 0,
          });

          //     // 개설강좌 ID
          const offeringId = await offeringService.getOrCreateOffering({
            course_id: courseId,
            year,
            semester,
            class_section: c.courseNumber || undefined,
            professor_id: professorId,
            department_id: null,
            schedule_summary: c.scheduleSummary || '',
            evaluation_type_code: undefined, // 필요하면 c에서 가져옴
            is_video_lecture: false,
            subject_establishment_semester: c.subjectEstablishmentSemesterCode
              ? parseInt(c.subjectEstablishmentSemesterCode, 10)
              : undefined,
            faculty_division_name:
              (c.facultyDivisionName as Database['public']['Enums']['course_area_type']) || undefined,
            area_code: c.areaCode,
            original_area_code: c.originalAreaCode,
            points: c.points || 0,
            host_department: c.departmentName || undefined,
          });

          //     // 성적(grade) 처리
          //     // mergedData 중 일부에는 grade, gpa 등이 있을 수 있음
          //     // 없으면 "IP" (In Progress)라 가정
          const grade = c.grade || 'IP';
          // 재수강 여부 처리를 수정
          const isRetake = c.retakeYearSemester && c.retakeYearSemester !== '-' ? true : false;

          studentCoursesToUpsert.push({
            student_id: studentId,
            offering_id: offeringId,
            original_score: c.originalScore,
            grade: grade as Database['public']['Enums']['grade_type'],
            points: c.points || 0,
            is_retake: isRetake,
          });
        }
      }

      // // 5) student_courses Upsert
      await studentCourseService.upsertStudentCourses(studentCoursesToUpsert);

      // 작업 완료 후 상태를 completed로
      setTask(taskId, 'completed', {
        student,
        mergedData,
        academicRecords,
      });
      // **세션 만료 처리**
      session.destroy(); // Iron Session에서 세션 데이터 삭제
      console.log('Session destroyed after successful scrape');
    } catch (err: any) {
      setTask(taskId, 'failed', { message: err.message });
    }
  })();

  return NextResponse.json({ taskId }, { status: 202 });
}
