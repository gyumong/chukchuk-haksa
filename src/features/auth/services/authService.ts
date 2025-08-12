import { deleteAccessToken, getAccessToken, setAccessToken, getRefreshToken, getPortalLinked, setPortalLinked, deletePortalLinked } from '@/lib/auth/token';
import { AuthError } from '@/lib/error';
import { authApi, userApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { SignInApiResponse } from '@/shared/api/data-contracts';

export const authService = {
  // 토큰 기반 인증 상태 확인
  isAuthenticated(): boolean {
    const token = getAccessToken();
    return Boolean(token);
  },

  // 포털 연동 상태 확인
  isPortalLinked(): boolean | null {
    return getPortalLinked();
  },

  // 로그인 처리
  async login(idToken: string, nonce: string, saveTokens = true) {
    try {
      const response = await ApiResponseHandler.handleAsyncResponse<SignInApiResponse>(
        userApi.signInUser({ id_token: idToken, nonce })
      );
      
      const { accessToken, refreshToken, isPortalLinked } = response.data;

      if (!accessToken) {
        throw new AuthError('Access token is missing');
      }

      if (saveTokens) {
        setAccessToken(accessToken);
        setPortalLinked(isPortalLinked);
      }

      return { accessToken, refreshToken, isPortalLinked };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // 토큰 갱신
  async refreshToken() {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        throw new AuthError('Refresh token is missing');
      }

      const response = await authApi.refreshResponse({ refreshToken });
      const { accessToken } = response.data.data;

      if (!accessToken) {
        throw new AuthError('Access token is missing');
      }

      setAccessToken(accessToken);
      return accessToken;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      throw error;
    }
  },

  // 로그아웃
  logout() {
    deleteAccessToken();
    deletePortalLinked();
    // 참고: queryClient는 여기서 접근할 수 없으므로 사용하는 쪽에서 처리
  },
};
