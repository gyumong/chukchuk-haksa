'use client';

import { useEffect } from 'react';
import { initAnalytics } from '@/lib/analytics/amplitude';
import { setUserProperties, WEB_VERSION } from '@/lib/analytics/userProperties';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

// Amplitude SDK 를 클라이언트 진입 직후 1회 초기화. 로그인 전 익명 트래픽도 device_id
// 단위로 잡히도록 early init. setAnalyticsUser/resetAnalytics 가 내부적으로도 ensureInit
// 호출하므로 Provider mount 순서에 무관하게 안전.
//
// 익명 단계에서도 `sys_web_version` 을 device_id 에 attach 해두면 어떤 빌드 버전이
// 이벤트를 보낸 건지 분석 단계에서 분리 가능. 로그인 후 user_id 가 채워져도 동일 값 유지.
export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  useEffect(() => {
    initAnalytics();
    setUserProperties({ sys_web_version: WEB_VERSION });
  }, []);

  return <>{children}</>;
}
