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
  CreateData,
  CreateRequest,
  ErrorResponseWrapper,
  GetDetailData,
  GetMyReportsData,
  GetMyReportsParams,
} from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class Reports<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 로그인 사용자의 문의를 생성 시각과 식별자 역순으로 조회합니다.
   *
   * @tags Reports
   * @name GetMyReports
   * @summary 내 문의 목록 조회
   * @request GET:/api/reports
   * @secure
   */
  getMyReports = (query: GetMyReportsParams, params: RequestParams = {}) =>
    this.request<GetMyReportsData, ErrorResponseWrapper>({
      path: `/api/reports`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 제목과 텍스트 본문으로 문의를 등록하고 생성 시점의 사용자·학적 정보를 보존합니다.
   *
   * @tags Reports
   * @name Create
   * @summary 문의 등록
   * @request POST:/api/reports
   * @secure
   */
  create = (data: CreateRequest, params: RequestParams = {}) =>
    this.request<CreateData, ErrorResponseWrapper>({
      path: `/api/reports`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 문의 제목·본문과 관리자 답변을 조회합니다. 다른 사용자의 문의에는 접근할 수 없습니다.
   *
   * @tags Reports
   * @name GetDetail
   * @summary 내 문의 상세 조회
   * @request GET:/api/reports/{reportId}
   * @secure
   */
  getDetail = (reportId: string, params: RequestParams = {}) =>
    this.request<GetDetailData, ErrorResponseWrapper>({
      path: `/api/reports/${reportId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
