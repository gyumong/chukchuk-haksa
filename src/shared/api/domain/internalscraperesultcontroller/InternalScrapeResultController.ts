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

import { HandleCallbackData } from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class InternalScrapeResultController<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags internal-scrape-result-controller
   * @name HandleCallback
   * @request POST:/internal/scrape-results
   * @secure
   */
  handleCallback = (data: string, params: RequestParams = {}) =>
    this.request<HandleCallbackData, any>({
      path: `/internal/scrape-results`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
