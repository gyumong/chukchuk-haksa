'use client';

import { Icon } from '@/components/ui';
import { Menu } from '@/components/ui/Menu';
import { ROUTES } from '@/constants/routes';
import { useIsAdminUser } from '@/features/admin/hooks/useIsAdminUser';
import { useInternalRouter } from '@/hooks/useInternalRouter';

const SettingPage = () => {
  const router = useInternalRouter();
  const isAdmin = useIsAdminUser();

  const menuItems = [
    ...(isAdmin === true
      ? [
          {
            label: '관리자 페이지',
            icon: <Icon name="arrow-right" size={24} />,
            onClick: () => router.push(ROUTES.ADMIN.HOME),
          },
        ]
      : []),
    {
      label: '문의하기',
      icon: <Icon name="arrow-right" size={24} />,
      onClick: () => router.push(ROUTES.INQUIRY.HOME),
    },
    {
      label: '탈퇴하기',
      color: '#FF5751',
      icon: <Icon name="arrow-right" size={24} />,
      onClick: () => router.push(ROUTES.DELETE),
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