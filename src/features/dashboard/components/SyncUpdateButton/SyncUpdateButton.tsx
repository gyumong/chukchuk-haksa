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
  const [reloadPromptOpen, setReloadPromptOpen] = useState(false);
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
      // dismissed: 광고 떴는데 거부/중단 → 보상 미획득 → 진행하지 않음(홈 유지).
      if (result === 'dismissed') {
        return;
      }
      // exhausted: 이 페이지에서 광고 이미 소진(GPT 페이지당 1개) → 우회 방지 위해 진행하지 않고
      //            새로고침 안내(reload 시 새 광고 1개 재장전).
      if (result === 'exhausted') {
        setReloadPromptOpen(true);
        return;
      }
      // granted(시청 완료) | unavailable(광고 자체가 없음) → 진행.
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
      <ConfirmDialog
        isOpen={reloadPromptOpen}
        title="광고 시청이 필요해요"
        message={'학업 정보 업데이트는 광고 시청 후 진행돼요.\n새로고침하고 다시 시도해주세요.'}
        confirmText="새로고침"
        cancelText="닫기"
        onConfirm={() => window.location.reload()}
        onClose={() => setReloadPromptOpen(false)}
      />
    </>
  );
};

export default SyncUpdateButton;
