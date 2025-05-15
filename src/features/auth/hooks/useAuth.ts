import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // 로그인
  const login = async (idToken: string, nonce: string) => {
    const result = await authService.login(idToken, nonce);
    return result;
  };

  // 토큰 갱신
  const refreshToken = async () => {
    return await authService.refreshToken();
  };

  // 로그아웃
  const logout = () => {
    authService.logout();
    queryClient.clear(); // React Query 캐시 정리
    router.push('/'); // 리디렉션
  };

  // 인증 상태 확인
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  return {
    login,
    logout,
    refreshToken,
    isAuthenticated,
  };
}
