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

import { ErrorResponseWrapper, HandleCallbackData } from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class PortalLink<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 스크래핑 워커가 API Gateway를 통해 전달하는 job 상태와 result_s3_key를 검증하고 DB에 반영합니다. 실제 결과 payload는 result_s3_key 기반으로 백엔드가 S3에서 조회합니다. HMAC 서명 규칙: signature = HMAC_SHA256("{timestamp}.{rawBody}").
   *
   * @tags Portal Link
   * @name HandleCallback
   * @summary [Internal] 스크래핑 결과 콜백 수신
   * @request POST:/internal/scrape-results
   * @secure
   */
  handleCallback = (data: string, params: RequestParams = {}) =>
    this.request<HandleCallbackData, ErrorResponseWrapper>({
      path: `/internal/scrape-results`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
