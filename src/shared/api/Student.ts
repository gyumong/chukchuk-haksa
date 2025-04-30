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
  ErrorResponseWrapper,
  GetProfileData,
  SetTargetGpaData,
  SetTargetGpaParams,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Student<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 로그인된 사용자의 목표 GPA를 저장합니다.
   *
   * @tags Student
   * @name SetTargetGpa
   * @summary 목표 GPA 설정
   * @request POST:/api/student/target-gpa
   * @secure
   */
  setTargetGpa = (query: SetTargetGpaParams, params: RequestParams = {}) =>
    this.request<SetTargetGpaData, ErrorResponseWrapper>({
      path: `/api/student/target-gpa`,
      method: "POST",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 로그인된 사용자의 프로필 정보를 조회합니다.
   *
   * @tags Student
   * @name GetProfile
   * @summary 사용자 프로필 조회
   * @request GET:/api/student/profile
   * @secure
   */
  getProfile = (params: RequestParams = {}) =>
    this.request<GetProfileData, ErrorResponseWrapper>({
      path: `/api/student/profile`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
