'use client';

import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { format } from 'date-fns/format';
import { isValid } from 'date-fns/isValid';
import { parseISO } from 'date-fns/parseISO';
import { Icon, showToast } from '@/components/ui';
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

// 자동 재개 플래그(sessionStorage). GPT 는 페이지당 rewarded 1개라, 광고가 한 번 소진되면 새 광고는
// reload 후에만 가능. exhausted 시 이 플래그를 세우고 reload → 재로드 후 마운트에서 광고 흐름을
// 자동 재개해 "수동 새로고침" 불편을 없앤다(게이트는 유지 — reload 후에도 광고를 봐야 진행).
const RESUME_AD_KEY = 'resync:resumeAd';

const SyncUpdateButton = ({ onNavigate }: SyncUpdateButtonProps = {}) => {
  const { data } = useProfileQuery();
  const router = useInternalRouter();
  const { showRewardedAd, optInDialog } = useRewardedAdGate();
  const [isRequesting, setIsRequesting] = useState(false);
  const parsedLastSyncedAt = data.lastSyncedAt ? parseISO(data.lastSyncedAt) : null;
  const formattedLastSyncedAt =
    parsedLastSyncedAt && isValid(parsedLastSyncedAt) ? format(parsedLastSyncedAt, 'yy년 M월 d일 HH:mm') : '';

  const handleResyncLogin = useCallback(async () => {
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
      // exhausted: 이 페이지에서 광고 이미 소진(GPT 페이지당 1개) → 우회 방지 + 수동 새로고침 제거 위해
      //            의도를 기억하고 자동 reload → 재로드 후 아래 useEffect 가 광고 흐름을 자동 재개.
      if (result === 'exhausted') {
        sessionStorage.setItem(RESUME_AD_KEY, '1');
        window.location.reload();
        return;
      }
      // granted(시청 완료) → 토스트 없이 바로 진행.
      // unavailable: 광고 매체가 광고를 안 주거나(no-fill) 네트워크 문제 등으로 노출 실패 → 막을 수 없으니
      //              안내 토스트를 띄우고 학업 정보 업데이트 화면으로 진행. 토스트는 전역(루트 레이아웃)
      //              이라 화면 전환 후에도 잠시 유지된다.
      if (result === 'unavailable') {
        showToast('지금은 광고가 없어 바로 학업 정보 업데이트 화면으로 이동합니다.');
      }
      router.push(ROUTES.RESYNC.LOGIN);
    } finally {
      setIsRequesting(false);
    }
  }, [onNavigate, isRequesting, showRewardedAd, router]);

  // 자동 재개: exhausted 로 reload 된 경우, 재로드 후 광고 흐름을 한 번 자동 시작(수동 새로고침 불필요).
  // 플래그를 즉시 지워 멱등 — handleResyncLogin 재생성으로 effect 가 재실행돼도 1회만 동작.
  // 앱 경로(onNavigate)에선 자동 재개하지 않는다(웹 전용).
  useEffect(() => {
    if (typeof window === 'undefined' || onNavigate) {
      return;
    }
    if (sessionStorage.getItem(RESUME_AD_KEY) === '1') {
      sessionStorage.removeItem(RESUME_AD_KEY);
      void handleResyncLogin();
    }
  }, [handleResyncLogin, onNavigate]);

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
