import { adminTestApi, graduationApi } from '@/shared/api/client';
import type {
  CourseOfferingOption,
  CreateTestCourseRequest,
  CreateTestUserRequest,
  DepartmentOption,
  GraduationProgressResponse,
  SearchCourseOfferingsParams,
  TestCourseResponse,
  TestOptionsResponse,
  TestUserResponse,
  UpdateGraduationCoursesRequest,
  UpdateMajorRequest,
} from '@/shared/api/data-contracts';
import { ApiError } from '@/shared/api/errors';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { AdminProgressRow, LectureEvaluationTestState } from '../types';
import { pushAdminLog } from './logStore';

// Admin Test API (dev 전용) 서비스 레이어.
// 모든 호출을 callAdmin 으로 감싸 Spring 래퍼({ success, data, message })를 언랩하고
// 성공/실패를 감사 로그에 남긴다. 실패는 그대로 throw 해 React Query 의 onError 로 흐른다.

interface SuccessWrapper<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** message-only 응답(강의평가 세팅 5종, reset 등)의 data. */
interface MessageOnlyData {
  message?: string;
}

function describeError(error: unknown): { message: string; payload: unknown } {
  if (error instanceof ApiError) {
    return {
      message: error.message,
      payload: { status: error.status, code: error.code, appCode: error.appCode },
    };
  }
  if (error instanceof Error) {
    return { message: error.message, payload: { name: error.name } };
  }
  return { message: '알 수 없는 오류', payload: error };
}

async function callAdmin<T>(method: string, path: string, request: Promise<Response>): Promise<T> {
  try {
    const wrapper = await ApiResponseHandler.handleAsyncResponse<SuccessWrapper<T>>(request);
    pushAdminLog({ method, path, ok: true, message: wrapper.message ?? '요청 성공', payload: wrapper.data });
    return wrapper.data;
  } catch (error) {
    const { message, payload } = describeError(error);
    pushAdminLog({ method, path, ok: false, message, payload });
    throw error;
  }
}

// ─── 무인증 (dev 백엔드가 토큰 없이 허용) ────────────────────────────────────

/** 테스트 계정 생성 + ac/re 토큰 발급. */
export function createTestUser(body: CreateTestUserRequest): Promise<TestUserResponse> {
  return callAdmin<TestUserResponse>('POST', '/api/admin/test-users', adminTestApi.createTestUser(body));
}

/** 학과·졸업요건 영역 선택지 조회. */
export function fetchTestOptions(): Promise<TestOptionsResponse> {
  return callAdmin<TestOptionsResponse>('GET', '/api/admin/test-options', adminTestApi.getTestOptions());
}

/** 학과 검색 (코드·학과명). */
export function searchDepartments(keyword: string): Promise<DepartmentOption[]> {
  return callAdmin<DepartmentOption[]>(
    'GET',
    `/api/admin/departments?keyword=${encodeURIComponent(keyword)}`,
    adminTestApi.searchDepartments({ keyword })
  );
}

/** 강의 후보(개설강의) 검색. */
export function searchCourseOfferings(params: SearchCourseOfferingsParams): Promise<CourseOfferingOption[]> {
  return callAdmin<CourseOfferingOption[]>(
    'GET',
    '/api/admin/course-offerings',
    adminTestApi.searchCourseOfferings(params)
  );
}

/**
 * 강의평가 상태 세팅 5종. 대상은 현재 세션 계정이 아니라 **백엔드가 고정한 프론트 테스트 계정**이다
 * (docs/admin-page-design.md §7-2).
 */
export function setLectureEvaluationState(state: LectureEvaluationTestState): Promise<MessageOnlyData> {
  const path = `/api/admin/test-lecture-evaluations/${state}`;
  const request = {
    skipped: () => adminTestApi.setLectureEvaluationSkipped(),
    pending: () => adminTestApi.setLectureEvaluationPending(),
    'not-released': () => adminTestApi.setLectureEvaluationNotReleased(),
    'empty-semester': () => adminTestApi.setLectureEvaluationEmptySemester(),
    completed: () => adminTestApi.setLectureEvaluationCompleted(),
  }[state];

  return callAdmin<MessageOnlyData>('POST', path, request());
}

// ─── @secure (현재 세션 계정 대상 — securityWorker 가 Bearer 자동 부착) ──────────

/** 현재 계정에 테스트 강의 생성. semester 는 학기 코드(10/15/20/25). */
export function createTestCourse(body: CreateTestCourseRequest): Promise<TestCourseResponse> {
  return callAdmin<TestCourseResponse>('POST', '/api/admin/me/test-courses', adminTestApi.createTestCourse(body));
}

/** 현재 계정의 수강 데이터·전공 상태 초기화. */
export function resetCurrentAccount(): Promise<MessageOnlyData> {
  return callAdmin<MessageOnlyData>('POST', '/api/admin/me/reset', adminTestApi.resetCurrentAccount());
}

/** 현재 계정의 주전공·복수전공 상태 수정. */
export function updateMajor(body: UpdateMajorRequest): Promise<MessageOnlyData> {
  return callAdmin<MessageOnlyData>('PATCH', '/api/admin/me/major', adminTestApi.updateMajor(body));
}

/** 현재 계정의 졸업요건 강의 추가/삭제. grade·points 등은 addOfferingIds 전체에 일괄 적용된다. */
export function updateGraduationCourses(body: UpdateGraduationCoursesRequest): Promise<MessageOnlyData> {
  return callAdmin<MessageOnlyData>(
    'PATCH',
    '/api/admin/me/graduation-courses',
    adminTestApi.updateGraduationCourses(body)
  );
}

// ─── 현재 계정 수강 현황 (조회 전용 — id 없음) ────────────────────────────────

/**
 * 졸업요건 진척을 평탄화해 "현재 계정이 어떤 강의를 갖고 있는지" 보여준다. **삭제용 id 는 못 얻는다.**
 *
 * dev 백엔드 실측 결과, 테스트 계정에서 row id 를 알려주는 읽기 API 는 존재하지 않는다:
 *  - GET /api/graduation/progress → 강의 객체가 {year, courseName, credits, grade, semester} 뿐 (id 없음)
 *  - GET /api/semester            → 항상 A03 "신입생은 학기 기록이 없습니다"
 *  - GET /api/academic/record     → 항상 A01 "해당 학기의 성적 데이터를 찾을 수 없습니다"
 * 따라서 삭제는 생성 시 응답으로 받은 studentCourseId(createdCourseStore)로만 가능하다.
 * (docs/admin-page-design.md §7-1)
 */
export async function fetchGraduationCourses(): Promise<AdminProgressRow[]> {
  const response = await callAdmin<GraduationProgressResponse>(
    'GET',
    '/api/graduation/progress',
    graduationApi.getGraduationProgress()
  );

  return (response.graduationProgress ?? []).flatMap(area =>
    (area.courses ?? []).map(course => ({
      area: area.areaType,
      courseName: course.courseName ?? '(이름 없음)',
      credits: course.credits ?? null,
      grade: course.grade ?? '',
      year: course.year ?? null,
      semester: course.semester ?? null,
    }))
  );
}
