'use client';

import { useEffect } from 'react';
import { initRemoteConfig } from '@/lib/remote-config/firebase';

interface RemoteConfigProviderProps {
  children: React.ReactNode;
}

// Firebase RemoteConfig SDK 를 클라이언트 진입 직후 1회 초기화. prod 외 환경에서는 init 가
// silent skip 되어 모든 `useRemoteConfig` 호출이 defaultValue 그대로 반환. Provider mount 순서에
// 무관하게 안전 — `useRemoteConfig` 가 내부적으로도 ensureInit 호출함.
//
// 사용자 타겟팅 (`setUserId` 등) 은 미지원: Firebase RemoteConfig 의 user-level targeting 은
// `firebase/analytics` (번들 大) 또는 v10+ Custom Signals 필요. v1 범위 외 — 환경/버전 조건만 사용.
export function RemoteConfigProvider({ children }: RemoteConfigProviderProps) {
  useEffect(() => {
    initRemoteConfig();
  }, []);

  return <>{children}</>;
}
