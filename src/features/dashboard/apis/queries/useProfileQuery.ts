import { useSuspenseQuery } from '@tanstack/react-query';
import { ROUTES } from '@/constants';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { studentApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { dashboardQueryKeys } from '../queryKey';
import { StudentProfileSchema } from '../schema';

export function useProfileQuery() {
  const router = useInternalRouter();
  // eslint-disable-next-line @tanstack/query/exhaustive-deps -- router는 side-effect용이라 queryKey에 포함 X. 후속 리팩터에서 redirect 로직을 컴포넌트로 분리 예정.
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: async () => {
      const response = await ApiResponseHandler.handleAsyncResponse(studentApi.getProfile());
      const profile = StudentProfileSchema.parse(response.data);

      if (profile.reconnectionRequired) {
        router.push(ROUTES.RESYNC.LOGIN);
      }
      return profile;
    },
  });
}
