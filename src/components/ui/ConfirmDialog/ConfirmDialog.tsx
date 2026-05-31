'use client';

import { useEffect, useId } from 'react';
import type { ReactNode } from 'react';
import styles from './ConfirmDialog.module.scss';

interface ConfirmDialogProps {
  isOpen: boolean;
  /** 다이얼로그 상단 타이틀. 미지정 시 "알림". */
  title?: string;
  /** 본문. 문자열(\n 줄바꿈 지원) 또는 리치 콘텐츠(ReactNode). */
  message: ReactNode;
  /** 확인 버튼 라벨. 미지정 시 "확인". */
  confirmText?: string;
  /** 취소 버튼 라벨. 미지정 시 "취소". */
  cancelText?: string;
  /** true 면 취소 버튼을 숨겨 단일 "확인" 정보성 다이얼로그로 동작. */
  hideCancel?: boolean;
  onConfirm: () => void;
  /** 취소 / 오버레이 클릭 / ESC 키. */
  onClose: () => void;
}

export function ConfirmDialog({
  isOpen,
  title = '알림',
  message,
  confirmText = '확인',
  cancelText = '취소',
  hideCancel = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  // 같은 페이지에 ConfirmDialog 가 2개 이상 마운트될 때 id 중복으로 aria-labelledby 가
  // 잘못 연결되지 않도록 인스턴스마다 고유 id 생성.
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={e => e.stopPropagation()}
      >
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <div className={styles.message}>{message}</div>
        <div className={styles.buttons}>
          {!hideCancel && (
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              {cancelText}
            </button>
          )}
          <button type="button" className={styles.confirmButton} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
