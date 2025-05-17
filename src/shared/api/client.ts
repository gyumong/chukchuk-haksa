import {
  AcademicRecord as AcademicRecordApi,
  Auth as AuthApi,
  Student as StudentApi,
  User as UserApi,
} from '@/shared/api/domain';
import { createApiConfig } from './configs/httpConfig';
import type { ErrorResponseWrapper } from './data-contracts';
import { ApiError } from './errors';
import { HttpClient } from './http-client';
import type { HttpResponse } from './http-client';

// API 응답 타입 정의
interface ApiResponse<TData> {
  success: boolean;
  data: TData;
  message: string;
}

// API 클라이언트 초기화
const apiConfig = createApiConfig();
export const http = new HttpClient(apiConfig);

// API 클라이언트 생성 헬퍼
export const createApiClient = <T extends new (...args: any) => any>(ApiClass: T) => {
  const instance = new ApiClass(apiConfig);
  const client: Record<string, any> = {};

  Object.keys(instance).forEach(key => {
    const method = instance[key];
    if (typeof method === 'function') {
      client[key] = async (...args: any[]) => {
        try {
          const res = await method.apply(instance, args);

          return res;
        } catch (error) {
          // swagger-client에서 throw한 HttpResponse일 수 있음
          if (error && typeof error === 'object' && 'status' in error && 'error' in error) {
            throw createApiError(error);
          }

          // 예상치 못한 에러 (ex: 네트워크 오류, JSON 파싱 오류 등)
          console.error('API 호출 중 예외 발생:', error);
          throw new ApiError(
            error instanceof Error ? error.message : '네트워크 오류가 발생했습니다',
            'NETWORK_ERROR',
            0
          );
        }
      };
    }
  });

  return client as {
    [K in keyof InstanceType<T>]: InstanceType<T>[K] extends (
      ...args: any[]
    ) => Promise<HttpResponse<ApiResponse<infer D>, ErrorResponseWrapper>>
      ? (...args: Parameters<InstanceType<T>[K]>) => Promise<HttpResponse<ApiResponse<D>, ErrorResponseWrapper>>
      : InstanceType<T>[K];
  };
};

// API 클라이언트 인스턴스
export const userApi = createApiClient(UserApi);
export const studentApi = createApiClient(StudentApi);
export const academicRecordApi = createApiClient(AcademicRecordApi);
export const authApi = createApiClient(AuthApi);

// 응답 검증 유틸리티 (필요하면 사용)
export function assertValidResponse<TData>(
  res: HttpResponse<ApiResponse<TData>, ErrorResponseWrapper>,
  errorMessage?: string
): asserts res is HttpResponse<ApiResponse<TData>, ErrorResponseWrapper> {
  if (!res || typeof res !== 'object' || !('data' in res)) {
    throw new ApiError('Invalid HttpResponse shape (non-object)', res as any);
  }

  if (!res.data?.data) {
    throw new ApiError(errorMessage ?? '유효하지 않은 응답', res as any);
  }

  if (!res.data.success) {
    throw new ApiError(res.data.message ?? 'API 요청 실패', res as any);
  }
}

function createApiError(response: any): ApiError {
  const status = response.status || 0;
  const errorData = response.error?.error || {};
  const message = errorData.message || '알 수 없는 오류가 발생했습니다';
  const code = errorData.code || '';

  return new ApiError(message, code, status);
}
