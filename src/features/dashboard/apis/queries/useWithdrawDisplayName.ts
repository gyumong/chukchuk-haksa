import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { studentApi } from '@/shared/api/client';
import type { StudentProfileApiResponse } from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { dashboardQueryKeys } from '../queryKey';
import { StudentProfileSchema } from '../schema';

/**
 * 탈퇴 확인 화면의 인사말 개인화 전용 훅. 연동 유저만 학생 프로필에서 이름을 가져온다.
 *
 * useProfileQuery(useSuspenseQuery) 와 의도적으로 다르다:
 * - 미연동 유저(GET /student/profile 이 401/404)에서도 throw 하지 않아 탈퇴 플로우를 막지 않는다.
 *   (기존 버그: 표시용 이름 조회 하나가 suspense throw → AsyncBoundary 에러화면 → 탈퇴 불가)
 * - isPortalLinked === true 일 때만 조회한다(미연동은 애초에 프로필이 없어 401/404 라 네트워크 낭비 방지).
 * - reconnectionRequired redirect 부수효과가 없다(탈퇴 도중 resync 로 튕기면 안 되므로).
 *
 * queryKey 는 dashboardQueryKeys.profile 로 useProfileQuery 와 공유 → 연동 유저는 캐시 적중.
 * @returns 연동 유저의 이름, 또는 미연동/조회 전이면 undefined.
 */
export function useWithdrawDisplayName(): string | undefined {
  const { isPortalLinked } = useAuth();

  const { data } = useQuery({
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

  // queryKey 를 useProfileQuery 와 공유하므로, 미연동인데 다른 경로에서 채워둔 캐시가 잡힐 수 있다.
  // 문서화된 계약(미연동/조회 전이면 undefined)을 보장하기 위해 isPortalLinked 로 한 번 더 가드한다.
  return isPortalLinked === true ? data?.name : undefined;
}
