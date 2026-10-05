import type { InquirySummary } from '../../types';
import { InquiryStatusBadge } from '../InquiryStatusBadge/InquiryStatusBadge';
import styles from './InquiryListItem.module.scss';

interface InquiryListItemProps {
  inquiry: InquirySummary;
  onClick: () => void;
}

export function InquiryListItem({ inquiry, onClick }: InquiryListItemProps) {
  return (
    <button type="button" className={styles.item} onClick={onClick}>
      <InquiryStatusBadge status={inquiry.status} />
      <p className={styles.title}>{inquiry.title}</p>
      <p className={styles.date}>{inquiry.createdAt}</p>
    </button>
  );
}