import type { ZodSchema } from 'zod';
import { AcademicRecord as AcademicRecordApi, Student as StudentApi, User as UserApi } from '@/shared/api/domain';
import { createApiConfig } from './configs/httpConfig';
import type { ErrorResponseWrapper } from './data-contracts';
import { ApiError } from './errors';
import { HttpClient } from './http-client';
import type { HttpResponse } from './http-client';

interface ApiResponse<TData> {
  success?: boolean;
  data?: TData;
  message?: string;
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

          // HttpResponse 타입 체크 추가
          if (res && typeof res === 'object' && 'data' in res) {
            assertValidResponse(res); // data.data 확인
            return res;
          }
          // 예외: 실제로 Response 객체가 리턴되었는데 잘못 처리된 경우
          if (res instanceof Response) {
            if (!res.ok) {
              const body = await res.clone().text();
              throw new ApiError(`HTTP ${res.status}`, {
                status: res.status,
                data: body,
              } as HttpResponse<any, any>);
            }
            return res;
          }

          throw new ApiError('Unknown response format', {
            status: 500,
            data: res,
          } as HttpResponse<any, any>);
        } catch (error) {
          console.error(`[API ERROR: ${String(key)}]`, error);
          throw error;
        }
      };
    }
  });

  return client as {
    [K in keyof InstanceType<T>]: InstanceType<T>[K] extends (...args: any[]) => Promise<HttpResponse<any, any>>
      ? (...args: Parameters<InstanceType<T>[K]>) => Promise<ReturnType<InstanceType<T>[K]>>
      : InstanceType<T>[K];
  };
};

export function makeUsecase<TIn, TOut>(
  apiFn: () => Promise<HttpResponse<ApiResponse<TIn>, ErrorResponseWrapper>>,
  schema: ZodSchema<TOut>
): () => Promise<TOut> {
  return async () => {
    const res = await apiFn();
    return schema.parse(res.data.data);
  };
}

// API 클라이언트 인스턴스
export const userApi = createApiClient(UserApi);
export const studentApi = createApiClient(StudentApi);
export const academicRecordApi = createApiClient(AcademicRecordApi);

// 응답 검증 유틸리티
export function assertValidResponse<TData>(
  res: HttpResponse<ApiResponse<TData>, ErrorResponseWrapper>,
  errorMessage?: string
): asserts res is HttpResponse<ApiResponse<TData>, ErrorResponseWrapper> {
  if (!res || typeof res !== 'object' || !('data' in res)) {
    throw new ApiError('Invalid HttpResponse shape (non-object)', res);
  }

  if (!res.data?.data) {
    throw new ApiError(errorMessage ?? '유효하지 않은 응답', res);
  }
}
