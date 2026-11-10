'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Icon } from '@/components/ui';
import { getUserMessage } from '@/shared/user-messages';
import { academicQueryKeys } from '../../../apis/queryKey';
import { fetchGraduationProgressResponse } from '../../../apis/service';
import { FIRST_YEAR_REQUIREMENTS_UNAVAILABLE, isApiErrorWithCode } from '../../../utils/firstYearUnavailable';
import styles from './FirstYearRequirementNotice.module.scss';

/**
 * 현재 1학년이라 적용할 졸업요건이 없을 때(G03) 졸업요건 화면 맨 위에 띄우는 알림 카드.
 *
 * 영역 섹션들과 같은 졸업진단 쿼리를 구독하지만 suspense 가 아니므로, 에러를 던지지 않고
 * 에러 코드만 보고 알림을 그린다. 영역 섹션 쪽 G03 는 GraduationSectionErrorFallback 이 숨긴다.
 */
export default function FirstYearRequirementNotice() {
  const [isDismissed, setIsDismissed] = useState(false);
  const { error } = useQuery({
    queryKey: academicQueryKeys.graduationProgress(),
    queryFn: fetchGraduationProgressResponse,
  });

  if (isDismissed || !isApiErrorWithCode(error, FIRST_YEAR_REQUIREMENTS_UNAVAILABLE)) {
    return null;
  }

  return (
    <section className={styles.card} role="status" aria-labelledby="first-year-requirement-notice-title">
      <div className={styles.header}>
        <Icon name="flower" size={20} className={styles.icon} />
        <h2 id="first-year-requirement-notice-title" className={styles.title}>
          알림
        </h2>
        <button
          type="button"
          className={styles.closeButton}
          aria-label="알림 닫기"
          onClick={() => setIsDismissed(true)}
        >
          <Icon name="close" size={20} />
        </button>
      </div>
      <p className={styles.message}>{getUserMessage(error.status, error.appCode, error.message)}</p>
    </section>
  );
}
