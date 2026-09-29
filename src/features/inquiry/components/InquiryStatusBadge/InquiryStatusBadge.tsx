import type { InquiryStatus } from '../../types';
import styles from './InquiryStatusBadge.module.scss';

export function InquiryStatusBadge({ status }: { status: InquiryStatus }) {
  return (
    <span className={status === 'answered' ? styles.answered : styles.pending}>
      {status === 'answered' ? '답변 완료' : '답변 대기 중'}
    </span>
  );
}