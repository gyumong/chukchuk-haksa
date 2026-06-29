'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { RoutePath } from '@/hooks/useInternalRouter';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { lectureEvaluationQueryKeys } from '../../apis/queryKey';
import { fetchLectureEvaluationStatus } from '../../apis/service';

interface LectureEvaluationEntryGateProps {
  children: React.ReactNode;
  evaluationRoute: RoutePath;
}

export function LectureEvaluationEntryGate({ children, evaluationRoute }: LectureEvaluationEntryGateProps) {
  const router = useInternalRouter();
  const statusQuery = useQuery({
    queryKey: lectureEvaluationQueryKeys.status(),
    queryFn: fetchLectureEvaluationStatus,
    staleTime: 0,
  });
  const isPending = statusQuery.data?.evaluationStatus === 'PENDING';

  useEffect(() => {
    if (isPending) {
      router.replace(evaluationRoute);
    }
  }, [evaluationRoute, isPending, router]);

  // 최초 상태 조회가 끝나기 전에 홈 카드가 먼저 렌더링되면 대시보드 API가 불필요하게 호출되고,
  // PENDING 사용자는 홈을 잠깐 본 뒤 강의평가 화면으로 이동하게 된다.
  if (statusQuery.isPending || isPending) {
    return null;
  }

  // 상태 조회 실패는 홈 진입을 막지 않는다. 일시적인 강의평가 API 장애가
  // 기존 대시보드 전체 장애로 확대되지 않도록 기존 fail-open 정책을 유지한다.
  return <>{children}</>;
}
