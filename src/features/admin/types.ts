import type { CreateTestCourseRequest } from '@/shared/api/data-contracts';

/** 졸업요건 영역. 생성 타입에서 그대로 파생해 백엔드 enum 과 어긋나지 않게 한다. */
export type GraduationArea = NonNullable<CreateTestCourseRequest['area']>;

/** 강의평가 상태 세팅 엔드포인트 5종의 path suffix. */
export type LectureEvaluationTestState = 'skipped' | 'pending' | 'not-released' | 'empty-semester' | 'completed';

/**
 * 졸업요건 진척(GET /api/graduation/progress)을 평탄화한 "현재 계정 수강 현황" 한 줄.
 *
 * **id 가 없다.** 이 응답의 강의(CourseDto)는 {year, courseName, credits, grade, semester} 뿐이라
 * 삭제에 필요한 student_course row id 를 여기서 얻을 수 없다(dev 백엔드 실측으로 확인). 학기별 성적
 * 상세(GET /api/academic/record)는 테스트 계정에서 늘 A01("성적 데이터를 찾을 수 없습니다")로 실패하고,
 * GET /api/semester 도 A03("신입생은 학기 기록이 없습니다")이라, **row id 를 알려주는 읽기 API 가
 * 하나도 없다**. 그래서 이 타입은 조회 전용이고, 삭제는 CreatedCourse(생성 시 받은 id)로만 한다.
 */
export interface AdminProgressRow {
  area: GraduationArea;
  courseName: string;
  credits: number | null;
  grade: string;
  year: number | null;
  /** 학기 코드 (10/15/20/25). */
  semester: number | null;
}

/**
 * ③-b(POST /api/admin/me/test-courses)로 생성해 studentCourseId 를 확보한 강의.
 *
 * 삭제(removeStudentCourseIds)에 넣을 수 있는 유일한 id 공급원이라 브라우저에 보관한다
 * (세션 전환 시 페이지가 리로드되므로 메모리에만 두면 날아간다 → localStorage).
 * ③-c 의 추가(addOfferingIds)는 응답이 message-only 라 id 를 돌려주지 않아 여기에 쌓을 수 없다.
 */
export interface CreatedCourse {
  studentCourseId: number;
  courseCode: string;
  courseName: string;
  area: GraduationArea;
  year: number | null;
  /** 학기 코드 (10/15/20/25). */
  semester: number | null;
}

/** 어드민 호출 1건의 감사 로그. 문의 대응 중 "방금 뭘 바꿨는지" 증적으로 쓴다. */
export interface AdminLogEntry {
  id: number;
  /** 클라이언트 로컬 시각 (HH:MM:SS). */
  time: string;
  method: string;
  path: string;
  ok: boolean;
  /** 백엔드 message 또는 에러 메시지. */
  message: string;
  /** 응답 data(성공) 또는 에러 상세(실패). */
  payload: unknown;
}
