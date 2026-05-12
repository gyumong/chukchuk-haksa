'use client';

import clsx from 'clsx';
import { format } from 'date-fns/format';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';
import { Icon } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './SyncUpdateButton.module.scss';

interface SyncUpdateButtonProps {
  onNavigate?: () => void;
}

const SyncUpdateButton = ({ onNavigate }: SyncUpdateButtonProps = {}) => {
  const { data } = useProfileQuery();
  const router = useInternalRouter();
  const parsedLastSyncedAt = data.lastSyncedAt ? parseISO(data.lastSyncedAt) : null;
  const formattedLastSyncedAt =
    parsedLastSyncedAt && isValid(parsedLastSyncedAt) ? format(parsedLastSyncedAt, 'yy년 M월 d일 HH:mm') : '';

  const handleResyncLogin = () => {
    if (onNavigate) {
      onNavigate();
      return;
    }
    router.push(ROUTES.RESYNC.LOGIN);
  };

  return (
    <button className={clsx(styles.container, styles.text, '--body-sm-medium')} onClick={handleResyncLogin}>
      {formattedLastSyncedAt ? `${formattedLastSyncedAt} 업데이트` : '정보 업데이트'}
      <Icon name="refresh" size={16} />
    </button>
  );
};

export default SyncUpdateButton;
