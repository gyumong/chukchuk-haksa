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

import { CreatePortalLinkJobData, LinkRequest } from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class PortalLinkController<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags portal-link-controller
   * @name CreatePortalLinkJob
   * @request POST:/portal/link
   * @secure
   */
  createPortalLinkJob = (data: LinkRequest, params: RequestParams = {}) =>
    this.request<CreatePortalLinkJobData, any>({
      path: `/portal/link`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
}
