'use client';

import { useState } from 'react';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { useSetTargetGpaMutation } from '@/features/student/apis/queries/useSetTargetGpaMutation';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { isInWebView, postBridgeMessage } from '@/lib/webview';
import { FunnelHeadline, ScoreInput } from '../components';
import styles from './page.module.scss';

// MPA(webview) 진입의 첫 연동 완료 신호. 네이티브가 webview 닫고 dashboard 갱신.
// 프로토콜: docs/mpa-school-link-handoff.md
const BRIDGE_DONE_PORTAL_LINK = 'done:portal-link';

export default function TargetScorePage() {
  const [score, setScore] = useState('3.5');
  const router = useInternalRouter();
  const mutation = useSetTargetGpaMutation();

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync(parseFloat(score));
      if (isInWebView()) {
        const posted = postBridgeMessage(BRIDGE_DONE_PORTAL_LINK);
        if (!posted) {
          // 브리지 송출 실패(race/예외) 시 사용자가 webview 에 정지하지 않도록
          // 기존 브라우저 경로와 동일한 fallback 으로 이동. Sentry 캡쳐는 bridge.ts 내부.
          router.push(`${ROUTES.MAIN}`);
        }
      } else {
        router.push(`${ROUTES.MAIN}`);
      }
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
