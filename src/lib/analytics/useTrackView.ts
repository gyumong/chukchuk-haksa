'use client';

import { useEffect } from 'react';
import { track, type ViewEventName } from '@/lib/analytics/events';

// 뷰 노출 이벤트(`*_view`) 를 컴포넌트 mount 시 1회 발화하는 hook.
// React 18 StrictMode 의 effect double-invoke 때문에 dev 에서 2회 발화될 수 있으나, prod 빌드는
// 정상 1회 — Amplitude 의 normal session dedup 도 짧은 간격 중복은 자동 처리.
//
// 페이로드가 필요한 이벤트(예: set_gpa)는 이 hook 으로 발화 불가 — `track()` 을 onClick 등에서
// 직접 호출할 것.
export function useTrackView(name: ViewEventName): void {
  useEffect(() => {
    track(name);
    // name 변경 시 다시 발화 — 동적으로 페이지 내 다른 view 를 트래킹하는 경우 대응.
  }, [name]);
}
