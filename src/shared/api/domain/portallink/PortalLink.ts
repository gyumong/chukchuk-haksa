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
  CreatePortalLinkJobData,
  ErrorResponseWrapper,
  GetJobDurationData,
  GetJobStatusData,
  GetJobSummaryData,
  HandleCallbackData,
  LinkRequest,
} from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class PortalLink<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 포털 자격 증명을 받아 비동기 스크래핑 job을 생성하고 polling endpoint를 반환합니다.
   *
   * @tags Portal Link
   * @name CreatePortalLinkJob
   * @summary 포털 연동 job 생성
   * @request POST:/portal/link
   * @secure
   */
  createPortalLinkJob = (data: LinkRequest, params: RequestParams = {}) =>
    this.request<CreatePortalLinkJobData, ErrorResponseWrapper>({
      path: `/portal/link`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 스크래핑 워커가 API Gateway를 통해 전달하는 job 상태와 result_s3_key를 검증하고 DB에 반영합니다. 실제 결과 payload는 result_s3_key 기반으로 백엔드가 S3에서 조회합니다. HMAC 서명 규칙: signature = HMAC_SHA256("{timestamp}.{rawBody}").
   *
   * @tags Portal Link
   * @name HandleCallback
   * @summary [Internal] 스크래핑 결과 콜백 수신
   * @request POST:/internal/scrape-results
   */
  handleCallback = (data: string, params: RequestParams = {}) =>
    this.request<HandleCallbackData, ErrorResponseWrapper>({
      path: `/internal/scrape-results`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description 요청된 job_id의 진행 상태, 오류 코드, 완료 시점 등을 제공합니다.
   *
   * @tags Portal Link
   * @name GetJobStatus
   * @summary 비동기 job 상태 조회
   * @request GET:/portal/link/jobs/{jobId}
   * @secure
   */
  getJobStatus = (jobId: string, params: RequestParams = {}) =>
    this.request<GetJobStatusData, ErrorResponseWrapper>({
      path: `/portal/link/jobs/${jobId}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description job이 성공적으로 완료된 경우 최신 학생 요약 데이터를 반환합니다.
   *
   * @tags Portal Link
   * @name GetJobSummary
   * @summary 비동기 job 요약 조회
   * @request GET:/portal/link/jobs/{jobId}/summary
   * @secure
   */
  getJobSummary = (jobId: string, params: RequestParams = {}) =>
    this.request<GetJobSummaryData, ErrorResponseWrapper>({
      path: `/portal/link/jobs/${jobId}/summary`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 요청된 job_id의 서버 기준 연동 시작/종료 시각과 소요 시간을 제공합니다.
   *
   * @tags Portal Link
   * @name GetJobDuration
   * @summary 비동기 job 소요 시간 조회
   * @request GET:/portal/link/jobs/{jobId}/duration
   * @secure
   */
  getJobDuration = (jobId: string, params: RequestParams = {}) =>
    this.request<GetJobDurationData, ErrorResponseWrapper>({
      path: `/portal/link/jobs/${jobId}/duration`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
