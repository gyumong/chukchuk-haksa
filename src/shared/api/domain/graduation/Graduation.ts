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
  GetGraduationProgressData,
  GetLanguageCertRequirementData,
} from "../../data-contracts";
import { HttpClient, RequestParams } from "../../http-client";

export class Graduation<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 로그인된 사용자의 졸업 요건 충족 여부와 외국어 졸업 인증 통과 여부를 조회합니다. areaType이 선교인 영역의 courses[] 과목은 liberalAreaCode를 포함할 수 있습니다. areaType이 선교가 아닌 영역의 courses[] 과목은 liberalAreaCode 키가 응답에 포함되지 않습니다. 편입생은 transferProgress에 총 취득학점, 편입 인정학점, GPA, 지정과목과 영역별 이수 현황을 반환합니다. 3학년 편입연도에서 2년 전의 학과별 일반 학생 기준을 적용해 전핵·전선 각각 50% 이상 취득했는지 비교합니다. 전핵 필수과목 목록을 판정하지 않으며 전취 학점은 전핵에 합산하지 않습니다. 기준을 확인할 수 없거나 복수전공 적용 정책이 미확정인 경우 해당 영역을 UNAVAILABLE로 표시합니다. 전체 졸업 자격을 확정하지 않는 부분 진단이므로 analysisStatus는 MANUAL_REVIEW_REQUIRED입니다.
   *
   * @tags Graduation
   * @name GetGraduationProgress
   * @summary 졸업 요건 진행 상황 조회
   * @request GET:/api/graduation/progress
   * @secure
   */
  getGraduationProgress = (params: RequestParams = {}) =>
    this.request<GetGraduationProgressData, ErrorResponseWrapper>({
      path: `/api/graduation/progress`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 로그인된 사용자의 학과 코드와 입학년도에 적용되는 외국어 인증 기준을 조회합니다. 미매핑 학과도 200 응답으로 반환됩니다.
   *
   * @tags Graduation
   * @name GetLanguageCertRequirement
   * @summary 외국어 인증 기준 조회
   * @request GET:/api/graduation/language-cert/requirement
   * @secure
   */
  getLanguageCertRequirement = (params: RequestParams = {}) =>
    this.request<GetLanguageCertRequirementData, ErrorResponseWrapper>({
      path: `/api/graduation/language-cert/requirement`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
}
