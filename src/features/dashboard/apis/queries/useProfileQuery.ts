import { useSuspenseQuery } from '@tanstack/react-query';
import { ROUTES } from '@/constants';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { isInWebView } from '@/lib/webview';
import { studentApi } from '@/shared/api/client';
import type { StudentProfileApiResponse } from '@/shared/api/data-contracts';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import { dashboardQueryKeys } from '../queryKey';
import { StudentProfileSchema } from '../schema';

export function useProfileQuery() {
  const router = useInternalRouter();
  // eslint-disable-next-line @tanstack/query/exhaustive-deps -- router는 side-effect용이라 queryKey에 포함 X. 후속 리팩터에서 redirect 로직을 컴포넌트로 분리 예정.
  return useSuspenseQuery({
    queryKey: dashboardQueryKeys.profile,
    queryFn: async () => {
      const response = await ApiResponseHandler.handleAsyncResponse<StudentProfileApiResponse>(
        studentApi.getProfile()
      );
      const profile = StudentProfileSchema.parse(response.data);

      if (profile.reconnectionRequired) {
        // 웹뷰(MPA)에선 MPA 재연동 라우트로 보내야 한다. 웹 전용 /resync/login 으로 보내면 웹뷰 안에서
        // 웹 재연동 플로우로 빠져 done:portal-link 브릿지가 끊긴다. (웹은 기존대로 /resync/login)
        router.push(isInWebView() ? ROUTES.MPA.RESYNC_LOGIN : ROUTES.RESYNC.LOGIN);
      }
      return profile;
    },
  });
}
