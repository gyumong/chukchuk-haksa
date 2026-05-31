'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import styles from './GeneralElectiveInfoDialog.module.scss';

interface GeneralElectiveInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// 졸업요건 '일반선택' 영역 설명 팝업. 공용 ConfirmDialog 를 단일 버튼(hideCancel) +
// 리치 본문(ReactNode)으로 재사용한다.
export function GeneralElectiveInfoDialog({ isOpen, onClose }: GeneralElectiveInfoDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="일반선택"
      hideCancel
      confirmText="확인"
      onConfirm={onClose}
      onClose={onClose}
      message={
        <div className={styles.body}>
          <p className={styles.paragraph}>
            일반적으로 전공선택(전선) 또는 선택교양(선교) 과목의 초과 이수 학점은 일반선택(일선)으로 계산됩니다.
          </p>
          <p className={styles.paragraph}>
            특히, 선택교양(선교) 과목의 경우 동일 영역에서 여러 과목을 수강하면, 초과된 과목은 일반선택(일선)으로 전환됩니다.
          </p>
          <p className={styles.paragraph}>
            <strong className={styles.example}>예시:</strong> 1영역 과목 2개를 수강한 경우, 한 과목은 일선으로 계산됩니다.
          </p>
        </div>
      }
    />
  );
}
