'use client';

import { useEffect } from 'react';
import { initAnalytics } from './amplitude';

// Amplitude SDK 를 클라이언트 진입 직후 1회 초기화. 로그인 전 익명 트래픽도 device_id
// 단위로 잡히도록 early init. setAnalyticsUser/resetAnalytics 가 내부적으로도 ensureInit
// 호출하므로 Provider mount 순서에 무관하게 안전.
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initAnalytics();
  }, []);

  return <>{children}</>;
}
