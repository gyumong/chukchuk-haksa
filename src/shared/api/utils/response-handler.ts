import type { HttpResponse, ErrorResponseWrapper } from '../http-client';

export type ApiResponse<T> = HttpResponse<T, ErrorResponseWrapper>;

export class ApiResponseHandler {
  static handleResponse<T>(response: ApiResponse<T>): T {
    if (!response.ok) {
      throw new Error(response.error?.error?.message || 'API 요청에 실패했습니다.');
    }
    return response.data;
  }
  
  static async handleAsyncResponse<T>(responsePromise: Promise<ApiResponse<T>>): Promise<T> {
    const response = await responsePromise;
    return this.handleResponse(response);
  }
}