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
  GetSemesterGradesData,
  GetSemesterRecordData,
} from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class SemesterController<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 사용자의 모든 학기 정보를 조회합니다.
   *
   * @tags semester-controller
   * @name GetSemesterRecord
   * @summary 사용자 학기 목록 조회
   * @request GET:/api/semester
   * @secure
   */
  getSemesterRecord = (params: RequestParams = {}) =>
    this.request<GetSemesterRecordData, ErrorResponseWrapper>({
      path: `/api/semester`,
      method: "GET",
      secure: true,
      ...params,
    });
  /**
   * @description 사용자의 학기 별 성적 정보를 조회합니다.
   *
   * @tags semester-controller
   * @name GetSemesterGrades
   * @summary 사용자 학기 별 성적 조회
   * @request GET:/api/semester/grades
   * @secure
   */
  getSemesterGrades = (params: RequestParams = {}) =>
    this.request<GetSemesterGradesData, ErrorResponseWrapper>({
      path: `/api/semester/grades`,
      method: "GET",
      secure: true,
      ...params,
    });
}
