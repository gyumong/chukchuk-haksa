import { useSuspenseQuery } from '@tanstack/react-query';
import { studentApi } from '@/shared/api/client';
import { dashboardQueryKeys } from '../queryKey';
import { StudentProfileSchema } from '../schema';

export function useProfileQuery() {
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: async () => {
      const res = await studentApi.getProfile();
      return StudentProfileSchema.parse(res.data.data);
    },
  });
}
