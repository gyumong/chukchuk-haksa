import Image from 'next/image';
import clsx from 'clsx';
import { Button, TopNavigation } from '@/components/ui';
import styles from './ErrorScreen.module.scss';

interface ErrorScreenProps {
  title?: string;
  message: string;
  code?: string;
  fullPage?: boolean;
  retryLabel?: string;
  onRetry?: () => void;
  onInquiry?: () => void;
  onBack?: () => void;
  linkLabel?: string;
  onLinkClick?: () => void;
}

export function ErrorScreen({
  title = '오류가 발생했어요',
  message,
  code,
  fullPage,
  retryLabel = '다시 시도하기',
  onRetry,
  onInquiry,
  onBack,
  linkLabel,
  onLinkClick,
}: ErrorScreenProps) {
  // 카드 단위(fullPage=false)에서는 순수 안내만 하고 버튼을 아예 보여주지 않는다.
  // 버튼(재시도/문의하기)은 화면 전체를 덮는 fullPage일 때만 노출한다.
  const showButtons = Boolean(fullPage);

  return (
    <div className={clsx(styles.container, fullPage && styles.fullPage)}>
      {fullPage && onBack && (
        <div className={styles.backNav}>
          <TopNavigation.Preset title="" type="back" onNavigationClick={onBack} />
        </div>
      )}

      <Image src="/images/illustrations/CommonError.png" alt="" width={160} height={160} />
      <p className={styles.title}>{title}</p>
      <p className={styles.message}>{message}</p>

      {showButtons && (onRetry || onInquiry) && (
        <div className={styles.buttons}>
          {onRetry && (
            <div className={styles.buttonItem}>
              <Button variant="secondary" width="full" onClick={onRetry}>
                {retryLabel}
              </Button>
            </div>
          )}
          {onInquiry && (
            <div className={styles.buttonItem}>
              <Button variant="error" width="full" onClick={onInquiry}>
                문의하기
              </Button>
            </div>
          )}
        </div>
      )}

      {showButtons && onLinkClick && (
        <button type="button" className={styles.linkButton} onClick={onLinkClick}>
          {linkLabel}
        </button>
      )}
    </div>
  );
}