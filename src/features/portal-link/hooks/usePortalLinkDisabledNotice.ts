'use client';

import { useCallback, useEffect, useState } from 'react';
import { PORTAL_LINK_DISABLED } from '@/constants/portal-link';

// 공지 문구나 중단 회차가 바뀌어 다시 보여줘야 하면 버전 suffix 를 올린다.
const NOTICE_SEEN_KEY = 'portal_link_disabled_notice_seen:v1';

// localStorage 가 차단된 환경(프라이버시 모드 등)에서도 페이지 세션 안에서는 1회로 묶기 위한 in-memory 가드.
let seenInMemory = false;

function hasSeenNotice(): boolean {
  if (seenInMemory) {
    return true;
  }
  try {
    return localStorage.getItem(NOTICE_SEEN_KEY) === '1';
  } catch {
    return false;
  }
}

function markNoticeSeen() {
  seenInMemory = true;
  try {
    localStorage.setItem(NOTICE_SEEN_KEY, '1');
  } catch {
    // 저장 실패 시 in-memory 가드만으로 세션 1회 보장.
  }
}

/**
 * 홈 진입 시 포털 연동 비활성화 공지를 디바이스당 1회만 띄운다.
 * 웹뷰는 진입마다 페이지를 새로 로드해 sessionStorage 로는 매번 뜨므로 localStorage 에 기록한다.
 * SSR 결과와 어긋나지 않도록 저장소 확인은 마운트 이후 effect 에서 한다.
 */
export function usePortalLinkDisabledNotice() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!PORTAL_LINK_DISABLED || hasSeenNotice()) {
      return;
    }
    // 표시 시점에 기록 — 확인을 누르지 않고 앱을 닫아도 다시 띄우지 않는다.
    markNoticeSeen();
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  return { isOpen, close };
}
