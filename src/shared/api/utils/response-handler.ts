import type { HttpResponse, ErrorResponseWrapper } from '../http-client';

export type ApiResponse<T> = HttpResponse<T, ErrorResponseWrapper>;

export class ApiResponseHandler {
  static handleResponse<T>(response: ApiResponse<T>): any {
    if (!response.ok) {
      throw new Error(response.error?.error?.message || 'API 요청에 실패했습니다.');
    }
    // Spring Boot API는 { success: boolean, data: T, message?: string } 형태로 응답
    return (response.data as any)?.data || response.data;
  }
  
  static async handleAsyncResponse<T>(responsePromise: Promise<ApiResponse<T>>): Promise<any> {
    const response = await responsePromise;
    return this.handleResponse(response);
  }
}