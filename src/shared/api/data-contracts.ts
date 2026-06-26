/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** 스크래핑 job 수락 응답 */
export interface AcceptedResponse {
  /**
   * job id
   * @example "job-123"
   */
  job_id?: string;
  /**
   * 상태 조회 경로
   * @example "/portal/link/jobs/job-123"
   */
  polling_endpoint?: string;
  /**
   * 수락 상태
   * @example "accepted"
   */
  status?: string;
}

/** 포털 링크 job 생성 수락 응답 */
export interface PortalLinkAcceptedApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 스크래핑 job 수락 응답 */
  data: AcceptedResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 에러 상세 정보 */
export interface ErrorDetail {
  /**
   * 에러 코드
   * @example "U01"
   */
  code: string;
  /**
   * 에러 메시지
   * @example "해당 사용자를 찾을 수 없습니다."
   */
  message: string;
  /** 에러 추가 정보 */
  details?: object | null;
}

/** API 에러 응답 포맷 */
export interface ErrorResponseWrapper {
  /**
   * 성공 여부
   * @example false
   */
  success: boolean;
  /** 에러 상세 정보 */
  error?: ErrorDetail;
}

/** 포털 연동 job 생성 요청 */
export interface LinkRequest {
  /**
   * 포털 타입
   * @example "suwon"
   */
  portal_type: string;
  /**
   * 포털 아이디
   * @example "17019013"
   */
  username: string;
  /**
   * 포털 비밀번호
   * @example "pw"
   */
  password: string;
}

/** 메시지 응답 DTO */
export interface MessageOnlyResponse {
  /**
   * 결과 메시지
   * @example "목표 학점 저장 완료"
   */
  message?: string;
}

/** 포털 링크 내부 콜백 처리 응답 */
export interface PortalLinkCallbackApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 메시지 응답 DTO */
  data: MessageOnlyResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 회원가입 및 로그인 응답 */
export interface SignInApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 회원가입 및 로그인 응답 */
  data: SignInResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 회원가입 및 로그인 응답 */
export interface SignInResponse {
  /**
   * Access Token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
  /**
   * Refresh Token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  refreshToken: string;
  /**
   * 포털 연동 여부
   * @example true
   */
  isPortalLinked: boolean;
}

/** 소셜 로그인 요청 정보 */
export interface SignInRequest {
  /**
   * OIDC Provider
   * @example "KAKAO"
   */
  provider: "KAKAO" | "APPLE";
  /** OIDC Provider에서 발급받은 ID 토큰 */
  id_token: string;
  /**
   * 로그인 시 사용한 nonce 값
   * @example "random_nonce_value"
   */
  nonce: string;
}

/** 목표 GPA 설정 응답 */
export interface TargetGpaApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 메시지 응답 DTO */
  data: MessageOnlyResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 성공 응답 포맷 */
export interface SuccessResponseMessageOnlyResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 메시지 응답 DTO */
  data: MessageOnlyResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 강의평가 제출 응답 */
export interface LectureEvaluationSubmitApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 메시지 응답 DTO */
  data: MessageOnlyResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

export interface SubmitEvaluation {
  /** @format int64 */
  courseId: number;
  /** @format int64 */
  professorId: number;
  selectedTags: (
    | "LOW_HOMEWORK"
    | "LOW_TEAM_PROJECT"
    | "ONLINE_EXAM"
    | "EXAM_REPLACED_BY_HOMEWORK"
    | "INTERESTING_LECTURE"
    | "INFORMATIVE_LECTURE"
    | "ABSOLUTE_EXAM"
    | "EASY_GRADE"
  )[];
  /**
   * @minLength 0
   * @maxLength 2000
   */
  review?: string;
}

export interface SubmitRequest {
  /** @format int32 */
  year: number;
  /** @format int32 */
  semester: number;
  /**
   * @maxItems 2147483647
   * @minItems 1
   */
  evaluations: SubmitEvaluation[];
}

/** 강의평가 건너뛰기 응답 */
export interface LectureEvaluationSkipApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 메시지 응답 DTO */
  data: MessageOnlyResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

export interface SkipRequest {
  /** @format int32 */
  year: number;
  /** @format int32 */
  semester: number;
}

/** Refresh Response DTO */
export interface RefreshResponse {
  /** 액세스 토큰 */
  accessToken: string;
  /** 리프레시 토큰 */
  refreshToken: string;
}

/** 토큰 재발급 응답 포맷 */
export interface RefreshTokenApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** Refresh Response DTO */
  data: RefreshResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 리프레시 토큰 요청 DTO */
export interface RefreshRequest {
  /** Refresh Token */
  refreshToken: string;
}

/** 테스트 계정 생성 요청 */
export interface CreateTestUserRequest {
  /**
   * 테스트 사용자 이름
   * @example "프론트테스트"
   */
  name?: string;
  /**
   * 학과 ID
   * @format int64
   * @example 1
   */
  departmentId?: number;
  /**
   * 주전공 학과 ID
   * @format int64
   * @example 1
   */
  majorId?: number;
  /**
   * 복수전공 학과 ID
   * @format int64
   * @example 2
   */
  secondaryMajorDepartmentId?: number;
  /**
   * 입학년도
   * @format int32
   * @example 2024
   */
  admissionYear?: number;
  /**
   * 포털 연동 여부. 비어 있으면 true로 처리합니다.
   * @example true
   */
  isPortalLinked?: boolean;
}

/** 성공 응답 포맷 */
export interface SuccessResponseTestUserResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 테스트 계정 생성 응답 */
  data: TestUserResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 테스트 계정 생성 응답 */
export interface TestUserResponse {
  /**
   * 사용자 ID
   * @format uuid
   */
  userId?: string;
  /**
   * 학생 ID
   * @format uuid
   */
  studentId?: string;
  /** 테스트 계정 이메일 */
  email?: string;
  /** 테스트 학번 */
  studentCode?: string;
  /** Access Token */
  accessToken?: string;
  /** Refresh Token */
  refreshToken?: string;
}

/** 현재 인증 계정 테스트 강의 생성 요청 */
export interface CreateTestCourseRequest {
  /** 테스트 학수번호. test_ prefix가 없으면 자동으로 붙습니다. */
  courseCode?: string;
  /** 테스트 과목명 */
  courseName?: string;
  /** 졸업요건 영역 */
  area?:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
  /**
   * 학과 ID
   * @format int64
   */
  departmentId?: number;
  /** 개설 학과명. departmentId가 없을 때 사용할 수 있습니다. */
  hostDepartment?: string;
  /**
   * 이수 연도
   * @format int32
   */
  year?: number;
  /**
   * 학기
   * @format int32
   */
  semester?: number;
  /**
   * 학점
   * @format int32
   */
  credits?: number;
  /** 성적 */
  grade?: string;
  /** 재수강 여부 */
  isRetake?: boolean;
  /**
   * 원점수
   * @format int32
   */
  originalScore?: number;
}

/** 성공 응답 포맷 */
export interface SuccessResponseTestCourseResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 현재 인증 계정 테스트 강의 생성 응답 */
  data: TestCourseResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 현재 인증 계정 테스트 강의 생성 응답 */
export interface TestCourseResponse {
  /**
   * 생성된 학생 수강 row ID
   * @format int64
   */
  studentCourseId?: number;
  /**
   * 생성된 개설강의 ID
   * @format int64
   */
  offeringId?: number;
  /** 생성된 학수번호 */
  courseCode?: string;
  /** 생성된 과목명 */
  courseName?: string;
  /** 졸업요건 영역 */
  area?:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
}

/** 현재 인증 계정 전공 상태 수정 요청 */
export interface UpdateMajorRequest {
  /**
   * 주전공 학과 ID
   * @format int64
   */
  majorDepartmentId?: number;
  /** 복수전공 사용 여부 */
  dualMajorEnabled?: boolean;
  /**
   * 복수전공 학과 ID
   * @format int64
   */
  secondaryMajorDepartmentId?: number;
}

/** 현재 인증 계정 강의 데이터 수정 요청 */
export interface UpdateGraduationCoursesRequest {
  /** 수정 대상 졸업요건 영역 */
  area?:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
  /** 추가할 개설강의 ID 목록 */
  addOfferingIds?: number[];
  /** 삭제할 학생 수강 row ID 목록 */
  removeStudentCourseIds?: number[];
  /**
   * 성적
   * @example "A+"
   */
  grade?: string;
  /**
   * 학점
   * @format int32
   * @example 3
   */
  points?: number;
  /**
   * 재수강 여부
   * @example false
   */
  isRetake?: boolean;
  /**
   * 원점수
   * @format int32
   * @example 95
   */
  originalScore?: number;
}

/** 스크래핑 job 상태 응답 */
export interface JobStatusResponse {
  job_id?: string;
  portal_type?: string;
  error_code?: string;
  error_message?: string;
  /** @format date-time */
  created_at?: string;
  /** @format date-time */
  updated_at?: string;
  /** @format date-time */
  finished_at?: string;
  status?: string;
  retryable?: boolean;
}

/** 포털 링크 job 상태 조회 응답 */
export interface PortalLinkJobStatusApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 스크래핑 job 상태 응답 */
  data: JobStatusResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 스크래핑 job 요약 응답 */
export interface JobSummaryResponse {
  job_id?: string;
  /** 포털 학생 요약 정보 */
  studentInfo?: StudentInfoSummary;
  /** @format date-time */
  finished_at?: string;
  status?: string;
}

/** 포털 링크 job 요약 조회 응답 */
export interface PortalLinkJobSummaryApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 스크래핑 job 요약 응답 */
  data: JobSummaryResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 포털 학생 요약 정보 */
export interface StudentInfoSummary {
  name?: string;
  school?: string;
  majorName?: string;
  studentCode?: string;
  /** @format int32 */
  gradeLevel?: number;
  status?: string;
  /** @format int32 */
  completedSemesterType?: number;
}

/** 스크래핑 job 소요 시간 응답 */
export interface JobDurationResponse {
  job_id?: string;
  /** @format date-time */
  started_at?: string;
  /** @format date-time */
  ended_at?: string;
  /** @format int64 */
  elapsed_millis?: number;
  elapsed_time?: string;
  status?: string;
  success?: boolean;
}

/** 포털 링크 job 소요 시간 조회 응답 */
export interface PortalLinkJobDurationApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 스크래핑 job 소요 시간 응답 */
  data: JobDurationResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 내 사용자 정보 조회 응답 */
export interface MeApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 내 사용자 정보 응답 */
  data: MeResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 내 사용자 정보 응답 */
export interface MeResponse {
  /**
   * 포털 연동 여부
   * @example true
   */
  isPortalLinked: boolean;
}

/** 사용자 분석 식별자 조회 응답 */
export interface AnalyticsIdApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 사용자 분석 식별자 응답 */
  data: AnalyticsIdResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 사용자 분석 식별자 응답 */
export interface AnalyticsIdResponse {
  /**
   * Amplitude 사용자 식별자
   * @example "550e8400-e29b-41d4-a716-446655440000"
   */
  analyticsId: string;
}

/** 학생 프로필 응답 */
export interface StudentProfileApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 학생 프로필 정보 */
  data: StudentProfileResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 학생 프로필 정보 */
export interface StudentProfileResponse {
  /** 이름 */
  name: string;
  /** 학번 */
  studentCode: string;
  /** 학과 이름 */
  departmentName: string;
  /** 전공 이름 */
  majorName: string;
  /** 복수전공 이름 */
  dualMajorName?: string;
  /**
   * 학년
   * @format int32
   */
  gradeLevel: number;
  /**
   * 현재 학기
   * @format int32
   */
  currentSemester: number;
  /** 재학 상태 */
  status: "재학" | "휴학" | "졸업" | "제적" | "수료";
  /** 마지막 업데이트 일시 */
  lastUpdatedAt: string;
  /** 학사 정보 마지막 연동 일시 */
  lastSyncedAt: string;
  /** 재연동 필요 여부 */
  reconnectionRequired: boolean;
}

/** 학생의 이수 학기 정보 */
export interface StudentSemesterInfoResponse {
  /**
   * 이수 연도
   * @format int32
   * @example 2023
   */
  year: number;
  /**
   * 이수 학기 코드 (10: 1학기, 15: 여름학기, 20: 2학기, 25: 겨울학기)
   * @format int32
   * @example 10
   */
  semester: number;
}

/** 사용자 학기 목록 응답 */
export interface StudentSemesterListApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 응답 데이터 */
  data: StudentSemesterInfoResponse[];
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 학기별 성적 목록 응답 */
export interface SemesterGradesApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 응답 데이터 */
  data: SemesterSummaryResponse[];
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 학기 요약 정보 (성적 포함) */
export interface SemesterSummaryResponse {
  /**
   * 이수 연도
   * @format int32
   * @example 2023
   */
  year: number;
  /**
   * 학기 코드 (10: 1학기, 15: 여름학기, 20: 2학기, 25: 겨울학기)
   * @format int32
   * @example 10
   */
  semester: number;
  /**
   * 취득 학점
   * @format int32
   * @example 15
   */
  earnedCredits?: number | null;
  /**
   * 신청 학점
   * @format int32
   * @example 18
   */
  attemptedCredits?: number | null;
  /**
   * 학기 GPA (평점 평균)
   * @example 3.85
   */
  semesterGpa?: number | null;
  /**
   * 석차
   * @format int32
   * @example 5
   */
  classRank?: number | null;
  /**
   * 전체 학생 수
   * @format int32
   * @example 150
   */
  totalStudents?: number | null;
  /**
   * 백분율
   * @example 92.4
   */
  percentile?: number | null;
}

/** 성적 카드 목록 */
export interface GradeCard {
  courseName?: string;
  courseCode?: string;
  /** @format int64 */
  courseId?: number;
  areaType?:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
  /** @format int32 */
  credits?: number;
  professor?: string;
  /** @format int64 */
  professorId?: number;
  grade?: string;
  /** @format int32 */
  score?: number;
  /** @format int32 */
  liberalAreaCode?: number;
}

/** 강의평가 상태 응답 */
export interface LectureEvaluationRequiredApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 응답 데이터 */
  data: RequiredResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 응답 데이터 */
export interface RequiredResponse {
  /** 강의평가 상태 */
  evaluationStatus?:
    | "NOT_RELEASED"
    | "PENDING"
    | "SKIPPED"
    | "COMPLETED"
    | null;
  /**
   * 강의평가 대상 연도
   * @format int32
   */
  year?: number;
  /**
   * 강의평가 대상 학기 코드
   * @format int32
   */
  semester?: number;
  /** 성적 카드 목록 */
  grades?: GradeCard[];
}

/** 졸업 요건 영역별 이수 현황 */
export interface AreaProgressDto {
  /** 영역 유형 (예: 전핵, 전선, 선교 등) */
  areaType:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
  /**
   * 해당 영역에서 필요한 학점
   * @format int32
   * @example 60
   */
  requiredCredits: number;
  /**
   * 학생이 이수한 학점
   * @format int32
   * @example 45
   */
  earnedCredits: number;
  /**
   * 필수 선택 과목 수
   * @format int32
   * @example 2
   */
  requiredElectiveCourses: number;
  /**
   * 학생이 이수한 선택 과목 수
   * @format int32
   * @example 1
   */
  completedElectiveCourses: number;
  /**
   * 총 선택 과목 수
   * @format int32
   * @example 3
   */
  totalElectiveCourses: number;
  /** 학생이 이수한 과목 목록 */
  courses: CourseDto[];
}

/** 이수 과목 정보 */
export interface CourseDto {
  /**
   * 이수 연도
   * @format int32
   * @example 2023
   */
  year: number;
  /**
   * 과목명
   * @example "자료구조"
   */
  courseName: string;
  /**
   * 학점
   * @format int32
   * @example 3
   */
  credits: number;
  /**
   * 성적
   * @example "A+"
   */
  grade: string;
  /**
   * 이수 학기
   * @format int32
   * @example 10
   */
  semester: number;
  /**
   * 교양/선교 영역 세부 코드 (LiberalArtsAreaCode). 선교 영역 등 sub-area가 정의된 과목에 한해 노출되며, 그 외 영역에서는 응답에서 omit된다.
   * @format int32
   * @example 7
   */
  liberalAreaCode?: number | null;
}

/** 졸업 요건 진행 상황 응답 */
export interface GraduationProgressApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 졸업 요건 진행 상황 응답 */
  data: GraduationProgressResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 졸업 요건 진행 상황 응답 */
export interface GraduationProgressResponse {
  /** 졸업 요건 영역별 이수 현황 */
  graduationProgress: AreaProgressDto[];
  /** 외국어 졸업 인증 통과 여부. 새 크롤러 동기화 전이면 null */
  languageCertFulfilled?: boolean | null;
  /** 외국어 졸업 인증 정보를 확인하려면 포털 새로고침이 필요한지 여부 */
  languageCertNeedsRefresh: boolean;
  /** 특정 학과/연도 예외로 기존과 다른 졸업요건이 적용되는지 여부 */
  hasDifferentGraduationRequirement: boolean;
}

/** 외국어 인증 기준 조회 응답 */
export interface LanguageCertRequirementApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 외국어 인증 기준 응답 */
  data: LanguageCertRequirementResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 외국어 인증 기준 응답 */
export interface LanguageCertRequirementResponse {
  /**
   * 기준 조회에 사용된 학과 코드
   * @example "2000514"
   */
  departmentCode?: string;
  /**
   * 기준 조회에 사용된 학과명
   * @example "컴퓨터SW"
   */
  departmentName?: string;
  /**
   * 입학년도
   * @format int32
   * @example 2021
   */
  admissionYear?: number;
  /**
   * 외국어 인증 정책 그룹 키
   * @example "ICT_OTHER"
   */
  policyGroupKey?: string | null;
  /**
   * 외국어 인증 정책 그룹명
   * @example "ICT융합대학 그외학부"
   */
  policyGroupName?: string | null;
  /** 학과-정책 매핑 상태 */
  matchStatus?: "VERIFIED" | "INFERRED" | "UNMAPPED";
  /**
   * 매핑 비고
   * @example "컴퓨터SW 21학번 이후 기준"
   */
  note?: string;
  /** 시험별 통과 기준 */
  requirements?: Requirement[];
}

/** 시험별 통과 기준 */
export interface Requirement {
  /** 시험 종류 */
  testType?:
    | "TOEIC"
    | "TOEFL_IBT"
    | "TEPS"
    | "OPIC"
    | "TOEIC_SPEAKING"
    | "JPT_JLPT"
    | "NEW_HSK"
    | "TORFL_FLEX"
    | "DELF";
  /**
   * 최소 점수
   * @format int32
   * @example 650
   */
  minimumScore?: number | null;
  /**
   * 최소 등급
   * @example "IM1"
   */
  minimumGrade?: string | null;
  /**
   * 표시 문구
   * @example "TOEIC 650점 이상"
   */
  displayText?: string;
  /**
   * 표시 순서
   * @format int32
   * @example 1
   */
  sortOrder?: number;
}

/** 학과 선택지 */
export interface DepartmentOption {
  /**
   * 학과 ID
   * @format int64
   */
  id?: number;
  /** 학과 코드 */
  code?: string;
  /** 학과명 */
  name?: string;
}

/** 졸업요건 영역 선택지 */
export interface GraduationAreaOption {
  /** 영역 코드 */
  code?: string;
  /** 영역 표시명 */
  name?: string;
}

/** 성공 응답 포맷 */
export interface SuccessResponseTestOptionsResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 테스트 조작 옵션 응답 */
  data: TestOptionsResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 테스트 조작 옵션 응답 */
export interface TestOptionsResponse {
  /** 학과 목록 */
  departments?: DepartmentOption[];
  /** 졸업요건 영역 목록 */
  graduationAreas?: GraduationAreaOption[];
}

/** 성공 응답 포맷 */
export interface SuccessResponseListDepartmentOption {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 응답 데이터 */
  data: DepartmentOption[];
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 강의 후보 선택지 */
export interface CourseOfferingOption {
  /**
   * 개설강의 ID
   * @format int64
   */
  offeringId?: number;
  /** 학수번호 */
  courseCode?: string;
  /** 과목명 */
  courseName?: string;
  /**
   * 연도
   * @format int32
   */
  year?: number;
  /**
   * 학기
   * @format int32
   */
  semester?: number;
  /**
   * 학점
   * @format int32
   */
  credits?: number;
  /** 졸업요건 영역 */
  area?:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
  /** 포털 원본 영역명 */
  rawArea?: string;
  /** 개설 학과명 */
  departmentName?: string;
}

/** 성공 응답 포맷 */
export interface SuccessResponseListCourseOfferingOption {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 응답 데이터 */
  data: CourseOfferingOption[];
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 학업 요약 정보 응답 */
export interface AcademicSummaryApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 학업 성적 요약 정보 */
  data: AcademicSummaryResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 학업 성적 요약 정보 */
export interface AcademicSummaryResponse {
  /**
   * 총 취득 학점
   * @format int32
   * @example 120
   */
  totalEarnedCredits: number;
  /**
   * 누적 GPA
   * @example 3.76
   */
  cumulativeGpa: number;
  /**
   * 전체 백분위
   * @example 87.5
   */
  percentile: number;
  /**
   * 필요 졸업 학점
   * @format int32
   * @example 130
   */
  requiredCredits: number;
}

/** 학기별 성적 및 수강 과목 정보 응답 */
export interface AcademicRecordApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 학기별 성적 및 수강 과목 응답 */
  data: AcademicRecordResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 학기별 성적 및 수강 과목 응답 */
export interface AcademicRecordResponse {
  /** 학기 성적 요약 정보 */
  semesterGrade: SemesterGradeResponse;
  /** 수강 과목 목록 */
  courses: Courses;
}

/** 수강 과목 상세 정보 */
export interface CourseDetailDto {
  /** 수강 ID */
  id?: string;
  /** 과목명 */
  courseName?: string;
  /** 학수번호 */
  courseCode?: string;
  /** 영역 (전공/교양 등) */
  areaType?:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
  /** 포털 원본 이수 구분 */
  rawAreaType?: string | null;
  /**
   * 학점
   * @format int32
   */
  credits?: number;
  /** 교수명 */
  professor?: string;
  /** 성적 */
  grade?: string;
  /**
   * 실 점수
   * @format int32
   */
  score?: number;
  /** 재수강 여부 */
  isRetake?: boolean;
  /** 사이버 강의 여부 */
  isOnline?: boolean;
  /**
   * 이수 연도
   * @format int32
   */
  year?: number;
  /**
   * 이수 학기
   * @format int32
   */
  semester?: number;
  /**
   * 원점수
   * @format int32
   */
  originalScore?: number;
  /**
   * 선교 영역 세부 코드 (LiberalArtsAreaCode). areaType 이 선교인 과목에 한해 노출되며, 그 외 영역에서는 응답에서 omit된다.
   * @format int32
   * @example 7
   */
  liberalAreaCode?: number | null;
  /** 재수강 삭제 과목 여부 */
  isRetakeDelete?: boolean;
}

/** 수강 과목 목록 */
export interface Courses {
  /** 전공 과목 목록 */
  major: CourseDetailDto[];
  /** 교양 과목 목록 */
  liberal: CourseDetailDto[];
  /** 기타 과목 목록 */
  etc: CourseDetailDto[];
}

/** 학기 성적 요약 정보 */
export interface SemesterGradeResponse {
  /**
   * 이수 연도
   * @format int32
   * @example 2024
   */
  year: number;
  /**
   * 학기 코드 (10: 1학기, 15: 여름학기, 20: 2학기, 25: 겨울학기)
   * @format int32
   * @example 10
   */
  semester: number;
  /**
   * 취득 학점
   * @format int32
   * @example 15
   */
  earnedCredits: number;
  /**
   * 신청 학점
   * @format int32
   * @example 18
   */
  attemptedCredits: number;
  /**
   * 학기 GPA (평점 평균)
   * @example 3.85
   */
  semesterGpa: number;
  /**
   * 석차
   * @format int32
   * @example 5
   */
  classRank: number | null;
  /**
   * 전체 학생 수
   * @format int32
   * @example 150
   */
  totalStudents: number | null;
  /**
   * 백분율
   * @example 92.4
   */
  percentile: number;
}

/** 회원 탈퇴 응답 포맷 */
export interface DeleteUserApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 메시지 응답 DTO */
  data: MessageOnlyResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

export type CreatePortalLinkJobData = PortalLinkAcceptedApiResponse;

export type HandleCallbackData = PortalLinkCallbackApiResponse;

export type SignInUserData = SignInApiResponse;

export interface SetTargetGpaParams {
  /**
   * 목표 GPA
   * @format double
   * @min 0
   * @exclusiveMin false
   * @max 4.5
   * @exclusiveMax false
   * @example 3.8
   */
  targetGpa?: number;
}

export type SetTargetGpaData = TargetGpaApiResponse;

export type ResetStudentDataData = SuccessResponseMessageOnlyResponse;

export type SubmitData = LectureEvaluationSubmitApiResponse;

export type SkipData = LectureEvaluationSkipApiResponse;

export type RefreshResponseData = RefreshTokenApiResponse;

export type CreateTestUserData = SuccessResponseTestUserResponse;

export type SetLectureEvaluationSkippedData =
  SuccessResponseMessageOnlyResponse;

export type SetLectureEvaluationPendingData =
  SuccessResponseMessageOnlyResponse;

export type SetLectureEvaluationNotReleasedData =
  SuccessResponseMessageOnlyResponse;

export type SetLectureEvaluationEmptySemesterData =
  SuccessResponseMessageOnlyResponse;

export type SetLectureEvaluationCompletedData =
  SuccessResponseMessageOnlyResponse;

export type CreateTestCourseData = SuccessResponseTestCourseResponse;

export type ResetCurrentAccountData = SuccessResponseMessageOnlyResponse;

export type UpdateMajorData = SuccessResponseMessageOnlyResponse;

export type UpdateGraduationCoursesData = SuccessResponseMessageOnlyResponse;

export type GetJobStatusData = PortalLinkJobStatusApiResponse;

export type GetJobSummaryData = PortalLinkJobSummaryApiResponse;

export type GetJobDurationData = PortalLinkJobDurationApiResponse;

export type HealthData = string;

export type GetMeData = MeApiResponse;

export type GetAnalyticsIdData = AnalyticsIdApiResponse;

export type GetProfileData = StudentProfileApiResponse;

export type GetSemesterRecordData = StudentSemesterListApiResponse;

export type GetSemesterGradesData = SemesterGradesApiResponse;

export type GetRequiredData = LectureEvaluationRequiredApiResponse;

export type GetGraduationProgressData = GraduationProgressApiResponse;

export type GetLanguageCertRequirementData = LanguageCertRequirementApiResponse;

export type GetTestOptionsData = SuccessResponseTestOptionsResponse;

export interface SearchDepartmentsParams {
  keyword?: string;
}

export type SearchDepartmentsData = SuccessResponseListDepartmentOption;

export interface SearchCourseOfferingsParams {
  keyword?: string;
  area?:
    | "중핵"
    | "기교"
    | "선교"
    | "소교"
    | "전교"
    | "전취"
    | "전핵"
    | "전선"
    | "일선"
    | "복선"
    | "복핵"
    | "복교"
    | "기타";
  /** @format int32 */
  year?: number;
  /** @format int32 */
  semester?: number;
  /** @format int64 */
  departmentId?: number;
}

export type SearchCourseOfferingsData = SuccessResponseListCourseOfferingOption;

export type GetAcademicSummaryData = AcademicSummaryApiResponse;

export interface GetAcademicRecordParams {
  /**
   * 연도
   * @format int32
   * @example 2024
   */
  year: number;
  /**
   * 학기
   * @format int32
   * @example "10, 15, 20 ..."
   */
  semester: number;
}

export type GetAcademicRecordData = AcademicRecordApiResponse;

export type DeleteUserData = DeleteUserApiResponse;
