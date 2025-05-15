import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../services/authService';

/**
 * 페이지 접근 시 인증 여부를 확인하고 필요에 따라 리디렉션하는 훅
 * @param redirectTo 인증되지 않았을 때 리디렉션할 경로
 * @returns {boolean} 인증 확인 중인지 여부
 */
export function useAuthCheck(redirectTo = '/') {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push(redirectTo);
    } else {
      setIsChecking(false);
    }
  }, [router, redirectTo]);

  return isChecking;
}
