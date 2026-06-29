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
  GetAcademicRecordData,
  GetAcademicRecordParams,
  GetAcademicSummaryData,
} from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class AcademicRecordController<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 로그인된 사용자의 학업 요약 정보를 조회합니다.
   *
   * @tags academic-record-controller
   * @name GetAcademicSummary
   * @summary 사용자 학업 요약 정보 조회
   * @request GET:/api/academic/summary
   * @secure
   */
  getAcademicSummary = (params: RequestParams = {}) =>
    this.request<GetAcademicSummaryData, ErrorResponseWrapper>({
      path: `/api/academic/summary`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 지정한 학기(year, semester)에 해당하는 성적 및 수강 과목 정보를 조회합니다. courses.liberal[] 중 areaType이 선교인 과목은 liberalAreaCode를 포함할 수 있습니다. areaType이 선교가 아닌 과목은 liberalAreaCode 키가 응답에 포함되지 않습니다.
   *
   * @tags academic-record-controller
   * @name GetAcademicRecord
   * @summary 학기별 성적 및 수강 과목 정보 조회
   * @request GET:/api/academic/record
   * @secure
   */
  getAcademicRecord = (
    query: GetAcademicRecordParams,
    params: RequestParams = {},
  ) =>
    this.request<GetAcademicRecordData, ErrorResponseWrapper>({
      path: `/api/academic/record`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
