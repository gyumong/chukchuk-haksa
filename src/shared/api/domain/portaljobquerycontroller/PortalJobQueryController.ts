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

import { GetJobStatusData, GetJobSummaryData } from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class PortalJobQueryController<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags portal-job-query-controller
   * @name GetJobStatus
   * @request GET:/portal/link/jobs/{jobId}
   * @secure
   */
  getJobStatus = (jobId: string, params: RequestParams = {}) =>
    this.request<GetJobStatusData, any>({
      path: `/portal/link/jobs/${jobId}`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * No description
   *
   * @tags portal-job-query-controller
   * @name GetJobSummary
   * @request GET:/portal/link/jobs/{jobId}/summary
   * @secure
   */
  getJobSummary = (jobId: string, params: RequestParams = {}) =>
    this.request<GetJobSummaryData, any>({
      path: `/portal/link/jobs/${jobId}/summary`,
      method: "GET",
      secure: true,
      ...params,
    });
}
