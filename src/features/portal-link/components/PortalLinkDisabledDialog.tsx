'use client';

import { ConfirmDialog } from '@/components/ui';
import { PORTAL_LINK_DISABLED_MESSAGE } from '@/constants/portal-link';

interface PortalLinkDisabledDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

// 포털 연동 일시 비활성화 공지. 홈 진입 시 자동으로, 재연동 버튼 탭 시 안내용으로 띄운다.
export function PortalLinkDisabledDialog({ isOpen, onClose }: PortalLinkDisabledDialogProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      title="안내"
      message={PORTAL_LINK_DISABLED_MESSAGE}
      hideCancel
      onConfirm={onClose}
      onClose={onClose}
    />
  );
}
