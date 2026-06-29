'use client';

import type { PropsWithChildren } from 'react';
import Script from 'next/script';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { ROUTES } from '@/constants/routes';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  const router = useInternalRouter();
  const handleRightIconClick = () => {
    router.push(ROUTES.SETTING);
  };

  return (
    <ProtectedRoute requirePortalLinked={true} portalLinkRedirectTo={ROUTES.FUNNEL.PORTAL_LOGIN}>
      {/* GAM(GPT) — 브라우저 /main 에서만 로드. (mpa) 웹뷰엔 절대 로드하지 않는다(AdSense/GAM 앱 정책 위반). */}
      <Script
        id="gpt-js"
        src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"
        strategy="afterInteractive"
      />
      <div className={styles.container}>
        <TopNavigation.Preset
          title="수원대학교"
          type="none"
          rightIcon="setting"
          onRightIconClick={handleRightIconClick}
        />
        <div className={styles.content}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
