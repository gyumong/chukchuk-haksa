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
  GetGraduationProgressData,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Graduation<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 로그인된 사용자의 졸업 요건 충족 여부를 조회합니다.
   *
   * @tags Graduation
   * @name GetGraduationProgress
   * @summary 졸업 요건 진행 상황 조회
   * @request GET:/api/graduation/progress
   * @secure
   */
  getGraduationProgress = (params: RequestParams = {}) =>
    this.request<GetGraduationProgressData, ErrorResponseWrapper>({
      path: `/api/graduation/progress`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
