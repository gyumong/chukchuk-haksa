'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/features/auth/contexts/AuthContext';
import { dashboardQueryKeys } from '@/features/dashboard/apis/queryKey';

// 네이티브 resync 후 WebView 복귀가 React 라이프사이클을 거치지 않을 수 있어 visibilitychange 로 보강.
// 배경/대안 비교: docs/profile-staleness-on-resync.md
export function useRefreshProfileOnVisible() {
  const queryClient = useQueryClient();
  const { hydrate } = useAuth();

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }
      // 세션(isPortalLinked 등)도 함께 재하이드레이션한다. profile 쿼리만 invalidate 하면
      // AuthContext 의 isPortalLinked 가 옛 값으로 남아, 네이티브 홈 복귀(webview 미reload) 시
      // 학교 연동 상태가 갱신되지 않는다. hydrate() 는 GET /api/session 을 다시 호출한다.
      void hydrate();
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.profile });
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [queryClient, hydrate]);
}
