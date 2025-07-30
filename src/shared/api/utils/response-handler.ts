import type { HttpResponse } from '../http-client';
import type { ErrorResponseWrapper } from '../data-contracts';

export type ApiResponse<T> = Response;

interface SpringBootApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class ApiResponseHandler {
  static async handleResponse<T extends SpringBootApiResponse<any>>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || 'API 요청에 실패했습니다.');
    }
    
    // JSON 파싱 후 반환
    const data = await response.json();
    return data;
  }
  
  static async handleAsyncResponse<T extends SpringBootApiResponse<any>>(responsePromise: Promise<Response>): Promise<T> {
    const response = await responsePromise;
    return this.handleResponse(response);
  }
}