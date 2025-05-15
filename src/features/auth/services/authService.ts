import { deleteAccessToken, getAccessToken, setAccessToken } from '@/lib/auth/token';
import { AuthError } from '@/lib/error';
import { authApi, userApi } from '@/shared/api/client';

interface SignInData {
  accessToken: string;
  isPortalLinked: boolean;
}

interface RefreshData {
  accessToken: string;
}

export const authService = {
  // 토큰 기반 인증 상태 확인
  isAuthenticated(): boolean {
    const token = getAccessToken();
    return Boolean(token);
  },

  // 로그인 처리
  async login(idToken: string, nonce: string) {
    try {
      const response = await userApi.signInUser({ id_token: idToken, nonce });
      const { accessToken, isPortalLinked } = response.data.data as SignInData;

      if (!accessToken) {
        throw new AuthError('Access token is missing');
      }

      setAccessToken(accessToken);
      return { isPortalLinked };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  // 토큰 갱신
  async refreshToken() {
    try {
      const response = await authApi.refreshResponse({});
      const { accessToken } = response.data.data as RefreshData;

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
    // 참고: queryClient는 여기서 접근할 수 없으므로 사용하는 쪽에서 처리
  },
};
