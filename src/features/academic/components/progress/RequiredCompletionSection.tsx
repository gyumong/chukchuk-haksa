'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui';
import { useLanguageCertStatusQuery } from '../../apis/queries/useGraduationProgressQuery';
import { useLanguageCertRequirementQuery } from '../../apis/queries/useLanguageCertRequirementQuery';
import { LanguageCertInfoDialog } from './LanguageCertInfoDialog/LanguageCertInfoDialog';
import styles from './RequiredCompletionSection.module.scss';

// 졸업요건 페이지의 '필수 이수내역' 섹션. 현재는 외국어인증제도 행만 노출한다.
// (졸업논문 등 추가 항목과 행별 '수정'(연필) 액션은 백엔드 데이터·플로우 확보 후 추가)
export default function RequiredCompletionSection() {
  const { data: status } = useLanguageCertStatusQuery();
  const { data: requirement } = useLanguageCertRequirementQuery();
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const isFulfilled = status.fulfilled === true;

  return (
    <>
      <div className={styles.title}>필수 이수내역</div>

      <div className={styles.row}>
        <span className={styles.name}>외국어인증제도</span>
        <span className={`${styles.status} ${isFulfilled ? styles.completed : styles.incomplete}`}>
          {isFulfilled ? '완료' : '미완료'}
        </span>
        <button
          type="button"
          className={styles.infoButton}
          aria-label="외국어인증제도 안내 보기"
          onClick={() => setIsInfoOpen(true)}
        >
          <Icon name="info" size={20} />
        </button>
      </div>

      <LanguageCertInfoDialog
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        requirement={requirement}
      />
    </>
  );
}
