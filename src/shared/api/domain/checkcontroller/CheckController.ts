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

import { ErrorResponseWrapper, HealthData } from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class CheckController<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags check-controller
   * @name SentryTest
   * @request GET:/sentry-test
   */
  sentryTest = (params: RequestParams = {}) =>
    this.request<any, ErrorResponseWrapper>({
      path: `/sentry-test`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags check-controller
   * @name Health
   * @request GET:/health
   */
  health = (params: RequestParams = {}) =>
    this.request<HealthData, any>({
      path: `/health`,
      method: "GET",
      ...params,
    });
}
