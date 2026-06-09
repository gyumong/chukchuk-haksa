'use client';

import { Icon } from '@/components/ui';
import { Menu } from '@/components/ui/Menu';
import { ROUTES } from '@/constants/routes';
import { useInternalRouter } from '@/hooks/useInternalRouter';

const MpaMePage = () => {
  const router = useInternalRouter();

  const menuItems = [
    {
      label: '탈퇴하기',
      color: '#FF5751',
      icon: <Icon name="arrow-right" size={24} />,
      // 네이티브 팝업/직접 bridge 대신 /mpa/delete 확인 페이지로 이동. 실제 탈퇴(withdraw 브릿지)는 그 페이지 버튼에서.
      onClick: () => router.push(ROUTES.MPA.DELETE),
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
