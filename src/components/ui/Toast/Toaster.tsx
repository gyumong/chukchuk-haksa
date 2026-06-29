'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { dismissToast, getToastsSnapshot, subscribeToasts, type ToastItem } from './toastStore';
import styles from './Toaster.module.scss';

const ToastRow = ({ toast }: { toast: ToastItem }) => {
  // 각 토스트는 마운트 시점에 자신의 자동 dismiss 타이머를 건다(언마운트 시 정리).
  useEffect(() => {
    const timer = setTimeout(() => dismissToast(toast.id), toast.duration);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration]);

  return <div className={styles.toast}>{toast.message}</div>;
};

/**
 * 전역 토스트 뷰포트. 루트 레이아웃에 한 번만 마운트한다.
 * showToast() 로 띄운 메시지를 화면 하단에 잠시 노출하고 자동으로 사라진다.
 * 모듈 스코프 스토어를 구독하므로 화면 전환 후에도 메시지가 유지된다.
 *
 * 접근성: aria-live 영역(뷰포트)을 비어 있어도 항상 DOM 에 유지한다. 스크린리더가 영역을 미리
 * 관찰하고 있어야 이후 삽입되는 토스트를 안정적으로 읽어주기 때문이다(영역과 내용을 동시에 마운트하면
 * 첫 토스트가 안내되지 않을 수 있음). live region 은 이 뷰포트 한 곳에만 둔다 — 각 행에 role="status"
 * 를 또 붙이면 polite live region 이 중첩돼 이중 안내가 날 수 있어 붙이지 않는다.
 */
export const Toaster = () => {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot);

  return (
    <div className={styles.viewport} aria-live="polite">
      {toasts.map(toast => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
