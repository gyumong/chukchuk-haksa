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
  GetLanguageCertRequirementData,
} from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class Graduation<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 로그인된 사용자의 졸업 요건 충족 여부와 외국어 졸업 인증 통과 여부를 조회합니다.
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
  /**
   * @description 로그인된 사용자의 학과 코드와 입학년도에 적용되는 외국어 인증 기준을 조회합니다. 미매핑 학과도 200 응답으로 반환됩니다.
   *
   * @tags Graduation
   * @name GetLanguageCertRequirement
   * @summary 외국어 인증 기준 조회
   * @request GET:/api/graduation/language-cert/requirement
   * @secure
   */
  getLanguageCertRequirement = (params: RequestParams = {}) =>
    this.request<GetLanguageCertRequirementData, ErrorResponseWrapper>({
      path: `/api/graduation/language-cert/requirement`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
