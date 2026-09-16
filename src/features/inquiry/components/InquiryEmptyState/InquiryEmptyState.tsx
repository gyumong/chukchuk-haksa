import styles from './InquiryEmptyState.module.scss';

export function InquiryEmptyState() {
  return (
    <div className={styles.container}>
      <p className={styles.text}>문의 내역이 존재하지 않습니다.</p>
    </div>
  );
}