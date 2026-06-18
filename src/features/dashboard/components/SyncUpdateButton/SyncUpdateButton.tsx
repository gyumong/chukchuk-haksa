'use client';

import { useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns/format';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';
import { Icon } from '@/components/ui';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { ROUTES } from '@/constants';
import { useRewardedAdGate } from '@/features/ads/useRewardedAdGate';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { EVENTS, track } from '@/lib/analytics';
import styles from './SyncUpdateButton.module.scss';

interface SyncUpdateButtonProps {
  onNavigate?: () => void;
}

const SyncUpdateButton = ({ onNavigate }: SyncUpdateButtonProps = {}) => {
  const { data } = useProfileQuery();
  const router = useInternalRouter();
  const { showRewardedAd, optInDialog } = useRewardedAdGate();
  const [isRequesting, setIsRequesting] = useState(false);
  const parsedLastSyncedAt = data.lastSyncedAt ? parseISO(data.lastSyncedAt) : null;
  const formattedLastSyncedAt =
    parsedLastSyncedAt && isValid(parsedLastSyncedAt) ? format(parsedLastSyncedAt, 'yy년 M월 d일 HH:mm') : '';

  const handleResyncLogin = async () => {
    track(EVENTS.HOME_UNIV_RESYNC_BTN_TAP);
    // 앱(웹뷰): 네이티브에 위임 — 광고는 네이티브 AdMob 책임이라 여기선 끼우지 않는다.
    if (onNavigate) {
      onNavigate();
      return;
    }
    if (isRequesting) {
      return;
    }
    setIsRequesting(true);
    try {
      const result = await showRewardedAd();
      // 광고가 떠 있었는데 거부/중단('dismissed')하면 보상 미획득 → 연동 진행하지 않음(홈 유지).
      // 광고 자체가 없으면('unavailable') 막을 수 없으니 그대로 진행.
      if (result === 'dismissed') {
        return;
      }
      router.push(ROUTES.RESYNC.LOGIN);
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <>
      <button
        type="button"
        className={clsx(styles.container, styles.text, '--body-sm-medium')}
        onClick={handleResyncLogin}
        disabled={isRequesting}
      >
        {formattedLastSyncedAt ? `${formattedLastSyncedAt} 업데이트` : '정보 업데이트'}
        <Icon name="refresh" size={16} />
      </button>
      <ConfirmDialog {...optInDialog} />
    </>
  );
};

export default SyncUpdateButton;
