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
  GetRequiredData,
  SkipData,
  SkipRequest,
  SubmitData,
  SubmitRequest,
} from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class LectureEvaluations<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 설정된 대상 학기의 강의평가 데이터를 일괄 제출합니다.
   *
   * @tags Lecture Evaluations
   * @name Submit
   * @summary 강의평가 제출
   * @request POST:/api/lecture-evaluations
   * @secure
   */
  submit = (data: SubmitRequest, params: RequestParams = {}) =>
    this.request<SubmitData, ErrorResponseWrapper>({
      path: `/api/lecture-evaluations`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 설정된 대상 학기의 강의평가 상태를 SKIPPED로 변경합니다.
   *
   * @tags Lecture Evaluations
   * @name Skip
   * @summary 강의평가 건너뛰기
   * @request POST:/api/lecture-evaluations/skip
   * @secure
   */
  skip = (data: SkipRequest, params: RequestParams = {}) =>
    this.request<SkipData, ErrorResponseWrapper>({
      path: `/api/lecture-evaluations/skip`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 설정된 대상 학기의 강의평가 상태와 성적 카드 목록을 조회합니다.
   *
   * @tags Lecture Evaluations
   * @name GetRequired
   * @summary 강의평가 상태 조회
   * @request GET:/api/lecture-evaluations/required
   * @secure
   */
  getRequired = (params: RequestParams = {}) =>
    this.request<GetRequiredData, ErrorResponseWrapper>({
      path: `/api/lecture-evaluations/required`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
