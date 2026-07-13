import { useSyncExternalStore } from 'react';
import type { AdminLogEntry } from '../types';

// 어드민 호출 감사 로그 — 모듈 스코프 스토어(toastStore 와 동일 패턴).
// service 레이어가 모든 요청의 성공/실패를 여기에 push 하므로, 어떤 섹션에서 호출하든
// 로그 패널 하나에 전부 모인다(문의 대응 중 조작 내역을 그대로 복사해 BE 에 전달 가능).

const MAX_ENTRIES = 20;

let entries: AdminLogEntry[] = [];
const listeners = new Set<() => void>();
let nextId = 0;

const emit = () => {
  listeners.forEach(listener => listener());
};

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// 변경이 있을 때만 새 배열로 교체 — useSyncExternalStore 가 불필요하게 재렌더하지 않도록
// 동일 참조를 유지한다. 서버 스냅샷도 같은 배열을 쓴다(초기엔 빈 배열이라 hydration 안전).
const getSnapshot = (): AdminLogEntry[] => entries;

export function pushAdminLog(entry: Omit<AdminLogEntry, 'id' | 'time'>): void {
  const next: AdminLogEntry[] = [
    {
      ...entry,
      id: nextId++,
      time: new Date().toLocaleTimeString('ko-KR', { hour12: false }),
    },
    ...entries,
  ];
  entries = next.slice(0, MAX_ENTRIES);
  emit();
}

export function clearAdminLog(): void {
  if (entries.length === 0) {
    return;
  }
  entries = [];
  emit();
}

/** 최신 항목이 앞에 오는 감사 로그 (최대 20건). */
export function useAdminLog(): AdminLogEntry[] {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
