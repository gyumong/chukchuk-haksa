'use client';

import { useEffect, useState } from 'react';
import { fetchAndActivateRemoteConfig, getRemoteConfigValue } from '@/lib/remote-config/firebase';
import type { RemoteConfigKey } from '@/lib/remote-config/keys';

/**
 * Firebase RemoteConfig 값을 React 컴포넌트에서 읽는 hook.
 *
 * 패턴: sync return with defaults + background refresh.
 * - 첫 렌더: `defaultValue` 즉시 반환 (network 대기 없음)
 * - `useEffect` 에서 `fetchAndActivate` 호출 후 cache 값으로 setState → 재렌더
 * - Suspense 안 씀: flag 하나마다 fallback 띄우면 UX 깨짐 + RemoteConfig 의 핵심 가치(default fallback)
 *   를 망가뜨림.
 *
 * dedupe: 동시 호출되는 여러 `useRemoteConfig` 는 `fetchAndActivateRemoteConfig` 내부 dedupe 으로
 * 단일 네트워크 요청. prod 외 환경/키 누락 시엔 즉시 default 만 반환하고 effect 도 noop.
 */
export function useRemoteConfig<T extends string | number | boolean>(
  key: RemoteConfigKey,
  defaultValue: T
): T {
  const [value, setValue] = useState<T>(defaultValue);

  useEffect(() => {
    let cancelled = false;
    void fetchAndActivateRemoteConfig().then(() => {
      if (cancelled) {
        return;
      }
      const resolved = getRemoteConfigValue<T>(key, defaultValue);
      setValue(prev => (Object.is(prev, resolved) ? prev : resolved));
    });
    return () => {
      cancelled = true;
    };
  }, [key, defaultValue]);

  return value;
}
