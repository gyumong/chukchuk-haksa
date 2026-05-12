'use client';

import { Icon } from '@/components/ui';
import { Menu } from '@/components/ui/Menu';
import { ROUTES } from '@/constants/routes';
import { navigateNative } from '@/lib/webview';

const MpaMePage = () => {
  const menuItems = [
    {
      label: '탈퇴하기',
      color: '#FF5751',
      icon: <Icon name="arrow-right" size={24} />,
      onClick: () => navigateNative(ROUTES.MPA.DELETE),
    },
  ];

  return (
    <div>
      <div className="gap-16" />
      <Menu items={menuItems} />
    </div>
  );
};

export default MpaMePage;
