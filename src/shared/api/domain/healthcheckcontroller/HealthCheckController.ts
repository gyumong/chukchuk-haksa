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

import { HealthData } from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class HealthCheckController<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags health-check-controller
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
