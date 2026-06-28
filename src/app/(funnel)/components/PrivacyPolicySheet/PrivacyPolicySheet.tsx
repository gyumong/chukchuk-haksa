'use client';

import { useEffect } from 'react';
import PrivacyPolicyContent from '@/app/privacy-policy/PrivacyPolicyContent';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { EVENTS, track } from '@/lib/analytics';
import styles from './PrivacyPolicySheet.module.scss';

interface PrivacyPolicySheetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyPolicySheet({ isOpen, onClose }: PrivacyPolicySheetProps) {
  // isOpen 트랜지션 시 1회 발화. unmount → mount 패턴 아님 (조건부 return null)
  // 이라 useTrackView 사용 불가 — useEffect 로 isOpen 의존성에 직접 묶음.
  useEffect(() => {
    if (isOpen) {
      track(EVENTS.UNIV_SYNC_TERM_AGREE_BOTTOMSHEET_VIEW);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay}>
      <TopNavigation.Preset title="개인 정보 수집 및 이용 동의 (필수)" type="close" onNavigationClick={onClose} />

      <PrivacyPolicyContent />

      <div className={styles.bottomIndicator} />
    </div>
  );
}
