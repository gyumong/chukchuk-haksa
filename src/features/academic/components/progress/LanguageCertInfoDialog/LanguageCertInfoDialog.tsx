'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { LanguageCertRequirementResponse } from '@/shared/api/data-contracts';
import { getRequirementValue, getTestLabel, sortRequirements } from '@/features/academic/utils/languageCertDisplay';
import styles from './LanguageCertInfoDialog.module.scss';

interface LanguageCertInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: LanguageCertRequirementResponse;
}

// 졸업요건 '외국어인증제도' 설명 팝업. 공용 ConfirmDialog 를 단일 버튼(hideCancel) + 리치 본문으로 재사용한다.
export function LanguageCertInfoDialog({ isOpen, onClose, requirement }: LanguageCertInfoDialogProps) {
  const { departmentName, admissionYear, note } = requirement;
  const requirements = sortRequirements(requirement.requirements);

  const yearLabel = admissionYear != null ? `${String(admissionYear).slice(-2)}학번` : '';
  const deptYear = [departmentName, yearLabel].filter(Boolean).join(' ');

  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="외국어인증제도"
      hideCancel
      confirmText="확인"
      onConfirm={onClose}
      onClose={onClose}
      message={
        <div className={styles.body}>
          <p className={styles.subtitle}>
            {deptYear && (
              <>
                <strong className={styles.emphasis}>{deptYear}</strong>의
                <br />
              </>
            )}
            외국어인증제도 필요 점수입니다.
          </p>

          {requirements.length > 0 ? (
            <ul className={styles.list}>
              {requirements.map((req, index) => (
                <li key={`${req.testType ?? 'req'}-${index}`} className={styles.row}>
                  <span className={styles.label}>{getTestLabel(req.testType)}</span>
                  <span className={styles.value}>{getRequirementValue(req)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.note}>{note ?? '학과별 외국어 인증 기준 정보를 준비 중입니다.'}</p>
          )}
        </div>
      }
    />
  );
}
