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

/** 카카오 로그인 요청 정보 */
export interface SignInRequest {
  /** 카카오에서 발급받은 ID 토큰 */
  id_token: string;
  /**
   * 로그인 시 사용한 nonce 값
   * @example "random_nonce_value"
   */
  nonce: string;
}

/** 포털 데이터 크롤링 응답 */
export interface ScrapingApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 포털 연동 또는 재연동 및 학업 이력 동기화 성공 응답 */
  data: ScrapingResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 포털 연동 또는 재연동 및 학업 이력 동기화 성공 응답 */
export interface ScrapingResponse {
  /**
   * 작업 ID
   * @example "4aabf0d0-1c23-4f3d-845e-24c9c943deed"
   */
  taskId?: string;
  /** 학생 정보 요약 */
  studentInfo?: StudentInfo;
}

/** 학생 정보 요약 */
export interface StudentInfo {
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

/** 포털 로그인 응답 */
export interface PortalLoginApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 포털 로그인 응답 */
  data: PortalLoginResponse;
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
}

/** 포털 로그인 응답 */
export type PortalLoginResponse = object;

/** 메시지 응답 DTO */
export interface MessageOnlyResponse {
  /**
   * 결과 메시지
   * @example "목표 학점 저장 완료"
   */
  message?: string;
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
  status: string;
  /** 마지막 업데이트 일시 */
  lastUpdatedAt: string;
  /** 학사 정보 마지막 연동 일시 */
  lastSyncedAt: string;
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

/** 학기별 성적 목록 응답 */
export interface SemesterGradesApiResponse {
  /**
   * 성공 여부
   * @example true
   */
  success: boolean;
  /** 응답 데이터 */
  data: SemesterGradeResponse[];
  /**
   * 메시지
   * @example "요청 성공"
   */
  message?: string;
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
    | "복선";
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
    | "복선";
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
}

/** 수강 과목 목록 */
export interface Courses {
  /** 전공 과목 목록 */
  major: CourseDetailDto[];
  /** 교양 과목 목록 */
  liberal: CourseDetailDto[];
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

export type SignInUserData = SignInApiResponse;

export type StartScrapingData = ScrapingApiResponse;

export type RefreshAndSyncData = ScrapingApiResponse;

export interface LoginParams {
  /** 포털 로그인 ID */
  username: string;
  /** 포털 로그인 비밀번호 */
  password: string;
}

export type LoginData = PortalLoginApiResponse;

export interface SetTargetGpaParams {
  /**
   * 목표 GPA
   * @format double
   * @example 3.8
   */
  targetGpa?: number;
}

export type SetTargetGpaData = TargetGpaApiResponse;

export type RefreshResponseData = RefreshTokenApiResponse;

export type HealthData = string;

export type GetProfileData = StudentProfileApiResponse;

export type GetSemesterRecordData = StudentSemesterListApiResponse;

export type GetSemesterGradesData = SemesterGradesApiResponse;

export type GetGraduationProgressData = GraduationProgressApiResponse;

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
