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

  return (
    <div className={styles.toast} role="status">
      {toast.message}
    </div>
  );
};

/**
 * 전역 토스트 뷰포트. 루트 레이아웃에 한 번만 마운트한다.
 * showToast() 로 띄운 메시지를 화면 하단에 잠시 노출하고 자동으로 사라진다.
 * 모듈 스코프 스토어를 구독하므로 화면 전환 후에도 메시지가 유지된다.
 */
export const Toaster = () => {
  const toasts = useSyncExternalStore(subscribeToasts, getToastsSnapshot, getToastsSnapshot);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className={styles.viewport} aria-live="polite">
      {toasts.map(toast => (
        <ToastRow key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
