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

import {
  CreateTestCourseData,
  CreateTestCourseRequest,
  CreateTestUserData,
  CreateTestUserRequest,
  ErrorResponseWrapper,
  GetTestOptionsData,
  ResetCurrentAccountData,
  SearchCourseOfferingsData,
  SearchCourseOfferingsParams,
  SearchDepartmentsData,
  SearchDepartmentsParams,
  SetLectureEvaluationCompletedData,
  SetLectureEvaluationEmptySemesterData,
  SetLectureEvaluationNotReleasedData,
  SetLectureEvaluationPendingData,
  SetLectureEvaluationSkippedData,
  UpdateGraduationCoursesData,
  UpdateGraduationCoursesRequest,
  UpdateMajorData,
  UpdateMajorRequest,
} from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class AdminTest<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description dev 환경에서 테스트 계정을 생성하고 JWT 토큰을 발급합니다.
   *
   * @tags Admin Test
   * @name CreateTestUser
   * @summary 테스트 계정 생성
   * @request POST:/api/admin/test-users
   */
  createTestUser = (data: CreateTestUserRequest, params: RequestParams = {}) =>
    this.request<CreateTestUserData, any>({
      path: `/api/admin/test-users`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 고정 프론트 테스트 계정의 target 학기를 강의평가 건너뛰기 상태로 재구성합니다.
   *
   * @tags Admin Test
   * @name SetLectureEvaluationSkipped
   * @summary dev 강의평가 SKIPPED 상태 세팅
   * @request POST:/api/admin/test-lecture-evaluations/skipped
   */
  setLectureEvaluationSkipped = (params: RequestParams = {}) =>
    this.request<SetLectureEvaluationSkippedData, any>({
      path: `/api/admin/test-lecture-evaluations/skipped`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * @description 고정 프론트 테스트 계정의 target 학기를 강의평가 대기 상태로 재구성합니다.
   *
   * @tags Admin Test
   * @name SetLectureEvaluationPending
   * @summary dev 강의평가 PENDING 상태 세팅
   * @request POST:/api/admin/test-lecture-evaluations/pending
   */
  setLectureEvaluationPending = (params: RequestParams = {}) =>
    this.request<SetLectureEvaluationPendingData, any>({
      path: `/api/admin/test-lecture-evaluations/pending`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * @description 고정 프론트 테스트 계정의 target 학기를 성적 미공개 상태로 재구성합니다.
   *
   * @tags Admin Test
   * @name SetLectureEvaluationNotReleased
   * @summary dev 강의평가 NOT_RELEASED 상태 세팅
   * @request POST:/api/admin/test-lecture-evaluations/not-released
   */
  setLectureEvaluationNotReleased = (params: RequestParams = {}) =>
    this.request<SetLectureEvaluationNotReleasedData, any>({
      path: `/api/admin/test-lecture-evaluations/not-released`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * @description 고정 프론트 테스트 계정의 target 학기 평가/수강/학기 row를 삭제합니다.
   *
   * @tags Admin Test
   * @name SetLectureEvaluationEmptySemester
   * @summary dev 강의평가 empty-semester 상태 세팅
   * @request POST:/api/admin/test-lecture-evaluations/empty-semester
   */
  setLectureEvaluationEmptySemester = (params: RequestParams = {}) =>
    this.request<SetLectureEvaluationEmptySemesterData, any>({
      path: `/api/admin/test-lecture-evaluations/empty-semester`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * @description 고정 프론트 테스트 계정의 target 학기를 강의평가 완료 상태로 재구성합니다.
   *
   * @tags Admin Test
   * @name SetLectureEvaluationCompleted
   * @summary dev 강의평가 COMPLETED 상태 세팅
   * @request POST:/api/admin/test-lecture-evaluations/completed
   */
  setLectureEvaluationCompleted = (params: RequestParams = {}) =>
    this.request<SetLectureEvaluationCompletedData, any>({
      path: `/api/admin/test-lecture-evaluations/completed`,
      method: "POST",
      format: "json",
      ...params,
    });
  /**
   * @description 테스트 강의와 개설강의를 만들고 현재 인증 계정의 수강 데이터에 바로 추가합니다.
   *
   * @tags Admin Test
   * @name CreateTestCourse
   * @summary 현재 계정 테스트 강의 생성
   * @request POST:/api/admin/me/test-courses
   * @secure
   */
  createTestCourse = (
    data: CreateTestCourseRequest,
    params: RequestParams = {},
  ) =>
    this.request<CreateTestCourseData, ErrorResponseWrapper>({
      path: `/api/admin/me/test-courses`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 인증 계정의 수강 데이터와 전공 상태를 프론트 테스트 기준 상태로 초기화합니다.
   *
   * @tags Admin Test
   * @name ResetCurrentAccount
   * @summary 현재 계정 테스트 데이터 초기화
   * @request POST:/api/admin/me/reset
   * @secure
   */
  resetCurrentAccount = (params: RequestParams = {}) =>
    this.request<ResetCurrentAccountData, ErrorResponseWrapper>({
      path: `/api/admin/me/reset`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 인증 계정의 주전공과 복수전공 상태를 수정합니다.
   *
   * @tags Admin Test
   * @name UpdateMajor
   * @summary 현재 계정 전공 상태 수정
   * @request PATCH:/api/admin/me/major
   * @secure
   */
  updateMajor = (data: UpdateMajorRequest, params: RequestParams = {}) =>
    this.request<UpdateMajorData, ErrorResponseWrapper>({
      path: `/api/admin/me/major`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 현재 인증 계정의 졸업요건 강의 데이터를 추가하거나 삭제합니다.
   *
   * @tags Admin Test
   * @name UpdateGraduationCourses
   * @summary 현재 계정 강의 데이터 수정
   * @request PATCH:/api/admin/me/graduation-courses
   * @secure
   */
  updateGraduationCourses = (
    data: UpdateGraduationCoursesRequest,
    params: RequestParams = {},
  ) =>
    this.request<UpdateGraduationCoursesData, ErrorResponseWrapper>({
      path: `/api/admin/me/graduation-courses`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description dev 환경에서 토큰 없이 학과와 졸업요건 영역 선택지를 조회합니다.
   *
   * @tags Admin Test
   * @name GetTestOptions
   * @summary 테스트 조작 옵션 조회
   * @request GET:/api/admin/test-options
   */
  getTestOptions = (params: RequestParams = {}) =>
    this.request<GetTestOptionsData, any>({
      path: `/api/admin/test-options`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * @description dev 환경에서 토큰 없이 학과 코드와 학과명으로 학과 선택지를 검색합니다.
   *
   * @tags Admin Test
   * @name SearchDepartments
   * @summary 학과 검색
   * @request GET:/api/admin/departments
   */
  searchDepartments = (
    query: SearchDepartmentsParams,
    params: RequestParams = {},
  ) =>
    this.request<SearchDepartmentsData, any>({
      path: `/api/admin/departments`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
  /**
   * @description dev 환경에서 토큰 없이 테스트 데이터에 추가할 개설강의 후보를 검색합니다.
   *
   * @tags Admin Test
   * @name SearchCourseOfferings
   * @summary 강의 후보 조회
   * @request GET:/api/admin/course-offerings
   */
  searchCourseOfferings = (
    query: SearchCourseOfferingsParams,
    params: RequestParams = {},
  ) =>
    this.request<SearchCourseOfferingsData, any>({
      path: `/api/admin/course-offerings`,
      method: "GET",
      query: query,
      format: "json",
      ...params,
    });
}
