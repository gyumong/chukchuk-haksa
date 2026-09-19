'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import styles from './TransferProgressInfoDialog.module.scss';

interface TransferProgressInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// 편입생 졸업요건 표시 형식 안내 팝업. 학생마다 인정학점·지정과목이 달라 일반 재학생과 같은
// 방식으로 확정할 수 없으므로, 어떤 형식으로 제공되는지 설명한다. (GeneralElectiveInfoDialog 와 동일 패턴)
export function TransferProgressInfoDialog({ isOpen, onClose }: TransferProgressInfoDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="편입생 졸업요건 안내"
      hideCancel
      confirmText="확인"
      onConfirm={onClose}
      onClose={onClose}
      message={
        <div className={styles.body}>
          <p className={styles.paragraph}>
            편입생은 학생마다 인정학점과 지정과목이 달라 일반 재학생과 같은 방식으로 졸업요건을 판정할 수 없어요. 그래서
            편입생의 졸업요건은 다음과 같은 형식으로 제공됩니다.
          </p>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <strong className={styles.label}>지정과목</strong>
              학과가 지정한 과목의 이수 여부와, 실제 이수한 지정과목 학점을 보여줍니다.
            </li>
            <li className={styles.listItem}>
              <strong className={styles.label}>전공핵심 · 전공선택</strong>
              편입연도 기준 일반 학생 기준학점의 50%를 기준으로 &lsquo;이수 학점 / 기준 학점&rsquo;으로 표시합니다.
            </li>
            <li className={styles.listItem}>
              <strong className={styles.label}>그 외 영역</strong>
              기준 학점 없이 이수한 학점만 표시합니다.
            </li>
          </ul>
          <p className={styles.paragraph}>
            부분 진단이므로 정확한 졸업 가능 여부는 학과 사무실에서 최종 확인해 주세요.
          </p>
        </div>
      }
    />
  );
}
