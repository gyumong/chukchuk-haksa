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
  RefreshRequest,
  RefreshResponseData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Auth<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 리프레시 토큰을 사용해 새로운 액세스 토큰과 리프레시 토큰을 발급합니다.
   *
   * @tags Auth
   * @name RefreshResponse
   * @summary 토큰 재발급
   * @request POST:/api/auth/refresh
   */
  refreshResponse = (data: RefreshRequest, params: RequestParams = {}) =>
    this.request<RefreshResponseData, ErrorResponseWrapper>({
      path: `/api/auth/refresh`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
}
