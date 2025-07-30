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
  LoginData,
  LoginParams,
  RefreshAndSyncData,
  StartScrapingData,
} from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class SuwonScraping<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description Redis에 저장된 포털 로그인 정보를 사용하여 데이터를 크롤링하고 초기화 및 학업 이력을 동기화합니다.
   *
   * @tags Suwon Scraping
   * @name StartScraping
   * @summary 포털 데이터 크롤링 및 동기화
   * @request POST:/api/suwon-scrape/start
   * @secure
   */
  startScraping = (params: RequestParams = {}) =>
    this.request<StartScrapingData, ErrorResponseWrapper>({
      path: `/api/suwon-scrape/start`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 포털 정보를 재연동하고 학업 이력을 다시 동기화합니다.
   *
   * @tags Suwon Scraping
   * @name RefreshAndSync
   * @summary 포털 정보 재연동 및 학업 이력 동기화
   * @request POST:/api/suwon-scrape/refresh
   * @secure
   */
  refreshAndSync = (params: RequestParams = {}) =>
    this.request<RefreshAndSyncData, ErrorResponseWrapper>({
      path: `/api/suwon-scrape/refresh`,
      method: "POST",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 수원대학교 포털 로그인 후 Redis에 계정 정보를 저장합니다.
   *
   * @tags Suwon Scraping
   * @name Login
   * @summary 포털 로그인
   * @request POST:/api/suwon-scrape/login
   * @secure
   */
  login = (query: LoginParams, params: RequestParams = {}) =>
    this.request<LoginData, ErrorResponseWrapper>({
      path: `/api/suwon-scrape/login`,
      method: "POST",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
}
