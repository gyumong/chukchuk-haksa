import Image from 'next/image';
import styles from './InquiryEmptyState.module.scss';

export function InquiryEmptyState() {
  return (
    <div className={styles.container}>
      {/* TODO: 디자이너에게 마스코트 에셋 받아서 교체 */}
      <Image src="/images/illustrations/InquiryEmpty.png" alt="" width={64} height={64} />
      <p className={styles.text}>문의 내역이 존재하지 않습니다.</p>
    </div>
  );
}