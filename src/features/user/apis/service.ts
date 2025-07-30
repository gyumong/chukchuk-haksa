import { userApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { DeleteUserApiResponse } from '@/shared/api/data-contracts';

/**
 * 사용자 계정을 삭제한다.
 */
export async function deleteUser() {
  const response = await ApiResponseHandler.handleAsyncResponse<DeleteUserApiResponse>(
    userApi.deleteUser()
  );
  return response.data;
}