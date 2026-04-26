import { AuthError } from '@/lib/error';
import { userApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { SignInApiResponse } from '@/shared/api/data-contracts';

export const authService = {
  async login(idToken: string, nonce: string, provider: 'KAKAO' | 'APPLE' = 'KAKAO') {
    const response = await ApiResponseHandler.handleAsyncResponse<SignInApiResponse>(
      userApi.signInUser({ provider, id_token: idToken, nonce })
    );

    const { accessToken, refreshToken, isPortalLinked } = response.data;

    if (!accessToken) {
      throw new AuthError('Access token is missing');
    }

    return { accessToken, refreshToken, isPortalLinked };
  },
};
