import { studentApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { TargetGpaApiResponse } from '@/shared/api/data-contracts';

/**
 * 목표 GPA를 설정한다.
 */
export async function setTargetGpa(targetGpa: number) {
  const response = await ApiResponseHandler.handleAsyncResponse<TargetGpaApiResponse>(
    studentApi.setTargetGpa({ targetGpa })
  );
  return response.data;
}