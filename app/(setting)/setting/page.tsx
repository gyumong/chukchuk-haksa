'use client';

import { useInternalRouter } from '@/hooks/useInternalRouter';
import { Icon } from '@/components/ui';
import { Menu } from '@/components/ui/Menu';

const SettingPage = () => {
  const router = useInternalRouter();

  const menuItems = [
    {
      label: '탈퇴하기',
      color: '#FF5751',
      icon: <Icon name="arrow-right" size={24} />,
      onClick: () => router.push('/delete'),
    },
  ];
  return (
    <div>
      <div className="gap-16" />
      <Menu items={menuItems} />
    </div>
  );
};

export default SettingPage;
