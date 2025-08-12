import { suwonScrapingApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { PortalLoginApiResponse } from '@/shared/api/data-contracts';

interface PortalLoginParams {
  username: string;
  password: string;
}

/**
 * 수원대학교 포털 로그인을 수행한다.
 */
export async function portalLogin({ username, password }: PortalLoginParams) {
  const response = await ApiResponseHandler.handleAsyncResponse<PortalLoginApiResponse>(
    suwonScrapingApi.login({ username, password })
  );
  return response.data;
}