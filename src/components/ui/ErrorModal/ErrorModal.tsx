'use client';

import { useEffect, useId } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import styles from './ErrorModal.module.scss';

interface ErrorModalProps {
  isOpen: boolean;
  message: string;
  code?: string;
  onRetry?: () => void;
  onInquiry?: () => void;
  /** 오버레이 클릭 / ESC / 닫기 버튼 */
  onClose: () => void;
}

export function ErrorModal({ isOpen, message, code, onRetry, onInquiry, onClose }: ErrorModalProps) {
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
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="닫기">
          <Icon name="close" size={20} />
        </button>
        <div className={styles.titleRow}>
          <Icon name="error-circle" size={20} />
          <h2 id={titleId} className={styles.title}>
            오류
          </h2>
        </div>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          {onRetry && (
            <div className={styles.buttonItem}>
              <Button type="button" variant="secondary" width="full" onClick={onRetry}>
                다시 시도하기
              </Button>
            </div>
          )}
          {onInquiry && (
            <div className={styles.buttonItem}>
              <Button type="button" variant="error" width="full" onClick={onInquiry}>
                문의하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}