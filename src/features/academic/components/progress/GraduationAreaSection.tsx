'use client';

import { useTransferProgressQuery } from '../../apis/queries/useGraduationProgressQuery';
import AreaProgressSection from './AreaProgressSection';
import TransferAreaProgressSection from './TransferAreaProgressSection';

// 졸업진단 학생 유형별 영역 섹션 분기.
// analysisType === 'TRANSFER' 이고 transferProgress 가 있으면 편입생 전용 섹션, 그 외(일반 학생·백엔드 미지원)는 기존 섹션.
export default function GraduationAreaSection() {
  const { data: transferProgress } = useTransferProgressQuery();

  if (transferProgress) {
    return <TransferAreaProgressSection progress={transferProgress} />;
  }

  return <AreaProgressSection />;
}
