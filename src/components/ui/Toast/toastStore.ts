// 전역 토스트 스토어 — 외부 의존성 없이 React 내장 useSyncExternalStore 로 구독한다.
// 화면 전환(router.push)으로 호출부 컴포넌트가 언마운트돼도 토스트가 유지되도록, Toaster 는
// 루트 레이아웃에 한 번만 마운트해 두고 여기(모듈 스코프)의 상태를 구독한다.

export interface ToastItem {
  id: number;
  message: string;
  duration: number;
}

type Listener = () => void;

// 메시지를 읽을 시간 확보 + 화면 전환 직후에도 잠시 보이도록 기본값을 넉넉히 둔다.
const DEFAULT_DURATION_MS = 3000;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();
let nextId = 0;

const emit = () => {
  listeners.forEach(listener => listener());
};

export const subscribeToasts = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// 변경이 있을 때만 새 배열로 교체하므로 동일 참조가 유지된다
// (useSyncExternalStore 가 불필요하게 재렌더하지 않도록). 서버 스냅샷도 동일하게 사용.
export const getToastsSnapshot = (): ToastItem[] => toasts;

export const showToast = (message: string, duration: number = DEFAULT_DURATION_MS): number => {
  const id = nextId++;
  toasts = [...toasts, { id, message, duration }];
  emit();
  return id;
};

export const dismissToast = (id: number): void => {
  const next = toasts.filter(toast => toast.id !== id);
  if (next.length !== toasts.length) {
    toasts = next;
    emit();
  }
};
