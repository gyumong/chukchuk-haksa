import { Icon } from '@/components/ui';
import styles from './OneOnOneInquiryCard.module.scss';

export function OneOnOneInquiryCard({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <div className={styles.header}>
        <span className={styles.title}>1:1 문의하기</span>
        <Icon name="arrow-right" size={20} />
      </div>
      <p className={styles.description}>작성하신 글은 척척학사 관리자에게 전달됩니다.</p>
    </button>
  );
}