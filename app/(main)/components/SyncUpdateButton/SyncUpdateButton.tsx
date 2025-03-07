import { Icon } from "@/components/ui";
import styles from './SyncUpdateButton.module.scss';
import { format } from "date-fns/format";
import clsx from "clsx";
export default function SyncUpdateButton({ lastSyncedAt, onClick }: { lastSyncedAt: string, onClick: () => void }) {

  const formattedLastSyncedAt = lastSyncedAt
  ? format(new Date(lastSyncedAt), "yy년 M월 d일 HH:mm")
  : '';
  
  return (
    <button className={clsx(styles.container, styles.text, '--body-sm-medium')} onClick={onClick}>
      {formattedLastSyncedAt} 업데이트
      <Icon name='refresh' size={16} />
    </button>
  );
}
