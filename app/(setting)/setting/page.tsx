'use client';

import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui';
import { Menu } from '@/components/ui/Menu';

const SettingPage = () => {
  const router = useRouter();

  const menuItems = [
    {
      label: '프로필 설정',
      icon: <Icon name="arrow-right" size={24} />,
      onClick: () => console.log('프로필 설정'),
    },
    {
      label: '약관 및 정책',
      icon: <Icon name="arrow-right" size={24} />,
      onClick: () => console.log('약관 및 정책'),
    },
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
