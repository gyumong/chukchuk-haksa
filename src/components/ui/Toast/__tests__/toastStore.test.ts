import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { showToast, dismissToast, getToastsSnapshot, subscribeToasts } from '../toastStore';

// toastStore 는 모듈 스코프 상태를 갖는다. 매 테스트 전에 남은 토스트를 비우고,
// 구독한 리스너는 테스트 후 해제해 테스트 간 격리를 보장한다.
describe('toastStore', () => {
  const unsubscribers: Array<() => void> = [];

  const subscribe = (listener: () => void) => {
    const unsubscribe = subscribeToasts(listener);
    unsubscribers.push(unsubscribe);
    return unsubscribe;
  };

  beforeEach(() => {
    for (const toast of getToastsSnapshot()) {
      dismissToast(toast.id);
    }
  });

  afterEach(() => {
    while (unsubscribers.length > 0) {
      unsubscribers.pop()?.();
    }
  });

  it('showToast 는 토스트를 추가하고 증가하는 id 를 반환한다', () => {
    const id1 = showToast('a');
    const id2 = showToast('b');

    expect(id2).toBe(id1 + 1);
    expect(getToastsSnapshot().map(toast => toast.message)).toEqual(['a', 'b']);
  });

  it('dismissToast 는 해당 토스트를 제거하고 구독자에게 알린다', () => {
    const id = showToast('a');
    const listener = vi.fn();
    subscribe(listener);

    dismissToast(id);

    expect(getToastsSnapshot()).toEqual([]);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  // useSyncExternalStore 무한 렌더 방지의 핵심 불변식:
  // 변화가 없으면 스냅샷이 동일 참조여야 하고 구독자에게 알리지 않아야 한다.
  it('존재하지 않는 id 를 dismiss 하면 동일 배열 참조를 유지하고 알리지 않는다', () => {
    showToast('a');
    const before = getToastsSnapshot();
    const listener = vi.fn();
    subscribe(listener);

    dismissToast(999999);

    expect(getToastsSnapshot()).toBe(before);
    expect(listener).not.toHaveBeenCalled();
  });

  it('변화가 없으면 getToastsSnapshot 은 동일 참조를 반환한다', () => {
    expect(getToastsSnapshot()).toBe(getToastsSnapshot());
  });

  it('스택 상한(3)을 초과하면 가장 오래된 토스트를 버린다', () => {
    showToast('1');
    showToast('2');
    showToast('3');
    showToast('4');

    const messages = getToastsSnapshot().map(toast => toast.message);
    expect(messages).toEqual(['2', '3', '4']);
    expect(messages.length).toBeLessThanOrEqual(3);
  });

  it('구독 해제 후에는 알림을 받지 않는다', () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    showToast('a');
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    showToast('b');
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('duration 미지정 시 기본값(4000ms)을 사용한다', () => {
    showToast('a');
    showToast('b', 5000);

    const [first, second] = getToastsSnapshot();
    expect(first.duration).toBe(4000);
    expect(second.duration).toBe(5000);
  });
});
