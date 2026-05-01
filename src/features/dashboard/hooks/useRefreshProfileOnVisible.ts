'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { dashboardQueryKeys } from '../apis/queryKey';

// 네이티브 resync 후 WebView 복귀가 React 라이프사이클을 거치지 않을 수 있어 visibilitychange 로 보강.
// 배경/대안 비교: docs/profile-staleness-on-resync.md
export function useRefreshProfileOnVisible() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        return;
      }
      queryClient.invalidateQueries({ queryKey: dashboardQueryKeys.profile });
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [queryClient]);
}
