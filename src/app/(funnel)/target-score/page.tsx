'use client';

import { useState } from 'react';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useSetTargetGpaMutation } from '@/features/student/apis/queries/useSetTargetGpaMutation';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { EVENTS, track } from '@/lib/analytics';
import { FunnelHeadline, ScoreInput } from '../components';
import styles from './page.module.scss';

export default function TargetScorePage() {
  const [score, setScore] = useState('3.5');
  const router = useInternalRouter();
  const mutation = useSetTargetGpaMutation();

  const handleSubmit = async () => {
    const gpa = parseFloat(score);
    track(EVENTS.UNIV_SYNC_SET_GPA_BTN_TAP, { gpa });
    try {
      await mutation.mutateAsync(gpa);
      // 학점 설정 후 외국어인증제도 확인 단계로 이동. webview 완료 신호(done:portal-link)는
      // 마지막 단계인 외국어인증제도 화면에서 송출한다(브라우저·webview 공통).
      router.push(`${ROUTES.FUNNEL.FOREIGN_LANGUAGE_CERT}`);
    } catch (error) {
      console.error('Failed to set target score:', error);
      alert(error instanceof Error ? error.message : '목표 학점 설정에 실패했습니다.');
    }
  };
  return (
    <ProtectedRoute requirePortalLinked={true}>
      <div className={styles.container}>
        <FunnelHeadline
          title="목표로 하시는<br/>졸업 학점을 입력해 주세요"
          description="목표 학점으로 졸업할 수 있게<br/>척척학사에서 도와드릴게요"
          highlightText="졸업 학점"
        />
        <div className="gap-100" />
        <ScoreInput value={score} onChange={setScore} />
        <FixedButton onClick={handleSubmit} isLoading={mutation.isPending}>
          다음
        </FixedButton>
      </div>
    </ProtectedRoute>
  );
}
