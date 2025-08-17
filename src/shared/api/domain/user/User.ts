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
  DeleteUserData,
  ErrorResponseWrapper,
  SignInRequest,
  SignInUserData,
} from "../../data-contracts";
import { ContentType, HttpClient, RequestParams } from "../../http-client";

export class User<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 사용자가 카카오 소셜 로그인으로 회원가입 및 로그인을 진행합니다.
   *
   * @tags User
   * @name SignInUser
   * @summary 회원 가입 및 로그인
   * @request POST:/api/users/signin
   * @secure
   */
  signInUser = (data: SignInRequest, params: RequestParams = {}) =>
    this.request<SignInUserData, ErrorResponseWrapper>({
      path: `/api/users/signin`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 로그인된 사용자의 계정을 삭제합니다.
   *
   * @tags User
   * @name DeleteUser
   * @summary 회원 탈퇴
   * @request DELETE:/api/users/delete
   * @secure
   */
  deleteUser = (params: RequestParams = {}) =>
    this.request<DeleteUserData, ErrorResponseWrapper>({
      path: `/api/users/delete`,
      method: "DELETE",
      secure: true,
      ...params,
    });
}
