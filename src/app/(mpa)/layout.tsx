'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { ROUTES } from '@/constants/routes';
import GraduationNavigationHeader from '@/features/academic/components/progress/GraduationNavigationHeader';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './layout.module.scss';

export default function MpaLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useInternalRouter();

  // mpa/home 만 Topbar 없음(네이티브 홈 헤더 사용). 그 외 페이지는 대응되는 웹 화면의 Topbar 를
  // 그대로 따른다. 뒤로가기는 useInternalRouter.back() 으로 — webview 에선 navigateBack 브릿지가
  // 함께 송출되고 웹 자체 뒤로가기도 수행된다. 펀널·로딩 페이지(portal-login·scraping·resync/scraping)는
  // 웹과 동일하게 Topbar 없음.
  const renderTopbar = (): ReactNode => {
    switch (pathname) {
      case ROUTES.MPA.GRADUATION_PROGRESS:
        // 웹 졸업요건과 동일한 동적 제목("{학번} {학부} 졸업요건") + 뒤로가기.
        return <GraduationNavigationHeader />;
      case ROUTES.MPA.ME:
        return <TopNavigation.Preset title="설정" type="back" onNavigationClick={() => router.back()} />;
      case ROUTES.MPA.RESYNC_LOGIN:
        return <TopNavigation.Preset title="" type="back" onNavigationClick={() => router.back()} />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        {renderTopbar()}
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
