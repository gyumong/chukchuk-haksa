'use client';

import { usePortalLinkDisabledNotice } from '../hooks/usePortalLinkDisabledNotice';
import { PortalLinkDisabledDialog } from './PortalLinkDisabledDialog';

// 홈 진입 공지(디바이스당 1회). 강의평가 게이트 안쪽에 두어, 강의평가로 리다이렉트되는 사용자는
// 공지를 보지 못한 채 '본 것'으로 기록되지 않게 한다.
export function PortalLinkDisabledHomeNotice() {
  const { isOpen, close } = usePortalLinkDisabledNotice();

  return <PortalLinkDisabledDialog isOpen={isOpen} onClose={close} />;
}
