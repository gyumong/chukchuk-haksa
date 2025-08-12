'use client';

import clsx from 'clsx';
import { format } from 'date-fns/format';
import { Icon } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './SyncUpdateButton.module.scss';

const SyncUpdateButton = () => {
  const { data } = useProfileQuery();
  const router = useInternalRouter();
  const formattedLastSyncedAt = data.lastUpdatedAt ? format(new Date(data.lastUpdatedAt), 'yy년 M월 d일 HH:mm') : '';

  const handleResyncLogin = () => {
    router.push(ROUTES.RESYNC.LOGIN);
  };

  return (
    <button className={clsx(styles.container, styles.text, '--body-sm-medium')} onClick={handleResyncLogin}>
      {formattedLastSyncedAt} 업데이트
      <Icon name="refresh" size={16} />
    </button>
  );
};

export default SyncUpdateButton;
