// dev 전용 Admin Test API 클라이언트.
//
// 생성된 FE 클라이언트엔 없는 surface라 raw HTTP로 호출한다. 브라우저 쿠키가 필요 없는 호출이라
// Playwright 의 APIRequestContext 대신 node 의 global fetch 를 쓴다
// (APIRequestContext 는 dev 백엔드의 gzip/content-length 응답에서 'unexpected number of bytes' 류
//  전송 계층 에러를 내는 경우가 있어, 견고한 node fetch 로 우회).
//
// 모든 호출은 dev 백엔드(ADMIN_BASE)로 직접 간다. 응답은 Spring 래퍼 { success, data, message, error }.
// 공개 API(test-users / test-options / departments / course-offerings)는 인증 불필요,
// /me/** 는 테스트 계정의 raw accessToken 을 Bearer 로 사용한다.
import { ADMIN_BASE } from './config';

export type Role = 'linked' | 'unlinked';

export interface TestUser {
  userId: string;
  studentId: string;
  email: string;
  studentCode: string;
  accessToken: string;
  refreshToken: string;
}

export interface Department {
  id: number;
  code: string;
  name: string;
}

export interface TestOptions {
  departments: Department[];
  graduationAreas: Array<{ code: string; name: string }>;
}

type Method = 'GET' | 'POST' | 'PATCH';

interface AdminCallOptions {
  token?: string;
  data?: unknown;
}

// 래퍼 언랩 + 실패/비JSON 응답은 상태코드·본문을 그대로 노출해 디버깅이 쉽도록 한다.
async function adminFetch<T>(method: Method, path: string, options: AdminCallOptions = {}): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  const init: RequestInit = { method, headers };
  if (method !== 'GET') {
    init.body = JSON.stringify(options.data ?? {});
  }

  const res = await fetch(`${ADMIN_BASE}${path}`, init);
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`[admin] ${method} ${path} → ${res.status} ${text.slice(0, 300)}`);
  }

  let body: unknown;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`[admin] ${method} ${path} 응답이 JSON 이 아님: ${text.slice(0, 200)}`);
  }

  // Spring 래퍼면 data 를, 아니면 그대로 반환.
  if (body && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

export interface CreateTestUserOptions {
  role: Role;
  name?: string;
  departmentId?: number;
  majorId?: number;
  secondaryMajorDepartmentId?: number | null;
  admissionYear?: number;
}

// 테스트 계정 생성 + ac/re 토큰 발급. role 에 따라 연동/미연동으로 만든다.
// 필드/응답은 dev OpenAPI(/v3/api-docs)로 확인됨:
//   CreateTestUserRequest.isPortalLinked: boolean, 응답 data = { userId, studentId, email, studentCode, accessToken, refreshToken }.
export function createTestUser(options: CreateTestUserOptions): Promise<TestUser> {
  return adminFetch<TestUser>('POST', '/api/admin/test-users', {
    data: {
      name: options.name ?? `E2E ${options.role}`,
      admissionYear: options.admissionYear ?? 2021,
      departmentId: options.departmentId,
      majorId: options.majorId,
      secondaryMajorDepartmentId: options.secondaryMajorDepartmentId,
      isPortalLinked: options.role === 'linked',
    },
  });
}

export function getTestOptions(): Promise<TestOptions> {
  return adminFetch<TestOptions>('GET', '/api/admin/test-options');
}

export function adminReset(token: string): Promise<unknown> {
  return adminFetch('POST', '/api/admin/me/reset', { token });
}

export interface MajorInput {
  majorDepartmentId: number;
  dualMajorEnabled: boolean;
  secondaryMajorDepartmentId: number | null;
}

export function setMajor(token: string, input: MajorInput): Promise<unknown> {
  return adminFetch('PATCH', '/api/admin/me/major', { token, data: input });
}

export interface TestCourseInput {
  area: string; // 필수 — 중핵/기교/선교/.../전핵/전선/일선/... 중 하나
  year: number;
  semester: number; // 10=1학기, 20=2학기, 15=여름, 25=겨울
  courseCode?: string;
  courseName?: string;
  departmentId?: number;
  hostDepartment?: string | null;
  credits?: number;
  grade?: string;
  isRetake?: boolean;
  originalScore?: number | null;
}

export interface TestCourseResult {
  studentCourseId: number;
  offeringId: number;
  courseCode: string;
  courseName: string;
  area: string;
}

export function addTestCourse(token: string, course: TestCourseInput): Promise<TestCourseResult> {
  return adminFetch<TestCourseResult>('POST', '/api/admin/me/test-courses', { token, data: course });
}

// 연동 계정인지 백엔드에서 직접 확인 (GET /api/users/me 의 isPortalLinked).
export async function fetchIsPortalLinked(token: string): Promise<boolean> {
  const res = await fetch(`${ADMIN_BASE}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`[admin] GET /api/users/me → ${res.status} ${text.slice(0, 200)}`);
  }
  let body: { data?: { isPortalLinked?: boolean }; isPortalLinked?: boolean };
  try {
    body = JSON.parse(text);
  } catch {
    throw new Error(`[admin] GET /api/users/me 응답이 JSON 이 아님: ${text.slice(0, 200)}`);
  }
  return Boolean(body?.data?.isPortalLinked ?? body?.isPortalLinked);
}
