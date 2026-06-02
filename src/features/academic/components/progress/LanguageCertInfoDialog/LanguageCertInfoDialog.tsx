'use client';

import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import type { LanguageCertRequirementResponse, Requirement } from '@/shared/api/data-contracts';
import styles from './LanguageCertInfoDialog.module.scss';

interface LanguageCertInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  requirement: LanguageCertRequirementResponse;
}

// 시험 종류 코드 → 표시 라벨. 백엔드는 testType 코드만 내려주고 표시 라벨은 프론트에서 매핑한다.
// (TORFL_FLEX 등 일부 라벨은 실제 응답 확인 후 디자인과 맞춰 조정 필요)
const TEST_TYPE_LABEL: Record<string, string> = {
  TOEIC: 'TOEIC',
  TOEFL_IBT: 'TOEFL (IBT)',
  TEPS: 'TEPS',
  OPIC: 'OPIc',
  TOEIC_SPEAKING: 'TOEIC Speaking',
  JPT_JLPT: 'JPT/JLPT',
  NEW_HSK: '新HSK',
  TORFL_FLEX: 'TORFL/FLEX',
  DELF: 'DELF',
};

function getTestLabel(testType: Requirement['testType']): string {
  if (!testType) {
    return '';
  }
  return TEST_TYPE_LABEL[testType] ?? testType;
}

// displayText 를 우선 사용하고, 없을 때만 점수/등급으로 폴백 구성한다.
function getRequirementValue(req: Requirement): string {
  if (req.displayText) {
    return req.displayText;
  }
  if (req.minimumScore != null) {
    return `${req.minimumScore}점 이상`;
  }
  if (req.minimumGrade) {
    return `${req.minimumGrade} 이상`;
  }
  return '';
}

// 졸업요건 '외국어인증제도' 설명 팝업. 공용 ConfirmDialog 를 단일 버튼(hideCancel) + 리치 본문으로 재사용한다.
export function LanguageCertInfoDialog({ isOpen, onClose, requirement }: LanguageCertInfoDialogProps) {
  const { departmentName, admissionYear, note } = requirement;
  const requirements = [...(requirement.requirements ?? [])].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  );

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
