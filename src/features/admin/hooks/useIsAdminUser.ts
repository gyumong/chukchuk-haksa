import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { dashboardQueryKeys } from '@/features/dashboard/apis/queryKey';
import { StudentProfileSchema } from '@/features/dashboard/apis/schema';
import { studentApi } from '@/shared/api/client';
import type { StudentProfileApiResponse } from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { isAdminUser } from '../utils/isAdminUser';

/**
 * 설정 화면/어드민 라우트 가드에서 "이 계정이 CS 계정인가"를 판별하는 훅.
 * undefined = 아직 판단 불가(로딩 중), false = 확정적으로 어드민 아님, true = 어드민.
 * 라우트 가드에서 undefined일 때 리다이렉트하면 안 되므로 세 값을 구분한다.
 */
export function useIsAdminUser(): boolean | undefined {
  const { isPortalLinked } = useAuth();

  const { data, isFetched } = useQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: async () => {
      const response = await ApiResponseHandler.handleAsyncResponse<StudentProfileApiResponse>(
        studentApi.getProfile()
      );
      return StudentProfileSchema.parse(response.data);
    },
    enabled: isPortalLinked === true,
    retry: false,
    throwOnError: false,
    staleTime: 5 * 60 * 1000,
  });

  if (isPortalLinked === false) {
    return false;
  }
  if (isPortalLinked !== true || !isFetched) {
    return undefined;
  }
  return isAdminUser(data?.studentCode);
}