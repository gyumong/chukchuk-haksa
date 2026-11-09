'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import styles from './ReferenceRankInfoDialog.module.scss';

interface ReferenceRankInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferenceRankInfoDialog({ isOpen, onClose }: ReferenceRankInfoDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="석차 제공 기준 변경 안내"
      hideCancel
      confirmText="확인"
      onConfirm={onClose}
      onClose={onClose}
      message={
        <div className={styles.body}>
          <p className={styles.paragraph}>
            교내 석차 데이터 제공 중단으로 기존의
            <br />
            <strong className={styles.strong}>전체 학생 기준 석차 제공이 중단되었습니다.</strong>
          </p>
          <p className={styles.paragraph}>
            앞으로는 <strong className={styles.accent}>척척학사 이용자 중</strong>
            <br />
            <strong className={styles.strong}>같은 학부·학과, 학년 내 석차를 제공합니다.</strong>
          </p>
          <p className={styles.note}>
            *학교 전체 학생을 기준으로 한 석차와는
            <br />
            다를 수 있으니 이용에 참고부탁드립니다.
          </p>
        </div>
      }
    />
  );
}
