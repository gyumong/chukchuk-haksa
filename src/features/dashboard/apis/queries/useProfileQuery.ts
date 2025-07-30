import { useSuspenseQuery } from '@tanstack/react-query';
import { studentApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { dashboardQueryKeys } from '../queryKey';
import { StudentProfileSchema } from '../schema';

export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: async () => {
      const response = await ApiResponseHandler.handleAsyncResponse(
        studentApi.getProfile()
      );
      return StudentProfileSchema.parse(response.data);
    },
  });
}
