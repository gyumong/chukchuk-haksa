import { useSuspenseQuery } from '@tanstack/react-query';
import { ROUTES } from '@/constants';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { studentApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { dashboardQueryKeys } from '../queryKey';
import { StudentProfileSchema } from '../schema';

export function useProfileQuery() {
  const router = useInternalRouter();
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
