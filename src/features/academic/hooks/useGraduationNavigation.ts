import { useMemo } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { createGraduationTitle } from '../utils/profileUtils';

/**
 * 졸업진도 페이지 네비게이션 관련 비즈니스 로직을 처리하는 훅
 */
export function useGraduationNavigation() {
  const router = useInternalRouter();
  const { data: profile, isLoading } = useProfileQuery();

  const navigationTitle = useMemo(() => {
    if (!profile) {
      return '졸업요건';
    }
    return createGraduationTitle(profile.studentCode, profile);
  }, [profile]);

  const handleBack = useMemo(() => {
    return () => {
      router.back();
    };
  }, [router]);

  return {
    navigationTitle,
    handleBack,
    isLoading: isLoading || !profile,
  };
}