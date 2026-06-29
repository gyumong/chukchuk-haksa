'use client';

import type { PropsWithChildren, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { ROUTES } from '@/constants/routes';
import GraduationNavigationHeader from '@/features/academic/components/progress/GraduationNavigationHeader';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { isInWebView, redirectToHome } from '@/lib/webview';
import styles from './layout.module.scss';

export default function MpaLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const router = useInternalRouter();

  // 재연동 진입점은 홈이다. 연동 실패 후 router.back() 은 jobId 가 비워진 stale /mpa/resync/scraping
  // ("연동 정보를 찾을 수 없어요") 로 떨어져 로그인↔스크래핑 루프에 갇힌다. resync/login 의 < 는
  // 히스토리 대신 항상 홈으로 보낸다 (성공 경로와 동일: webview 는 네이티브에 위임, web 은 라우팅).
  const goHome = () => {
    // webview 는 네이티브에 홈 이동을 위임한다. 브리지 송출 실패(미존재/예외)면 사용자가 멈추지
    // 않도록 web 경로와 동일하게 라우팅 fallback (성공 경로의 done:portal-link 처리와 동일 패턴).
    if (isInWebView() && redirectToHome()) {
      return;
    }
    router.push(ROUTES.MPA.HOME);
  };

  // mpa/home 만 Topbar 없음(네이티브 홈 헤더 사용). 그 외 페이지는 대응되는 웹 화면의 Topbar 를
  // 그대로 따른다. 뒤로가기는 useInternalRouter.back() 으로 — webview 에선 navigateBack 브릿지가
  // 함께 송출되고 웹 자체 뒤로가기도 수행된다. 펀널·로딩 페이지(portal-login·scraping·resync/scraping)는
  // 웹과 동일하게 Topbar 없음.
  // 대응되는 웹 화면과 여백을 맞추기 위해 라우트별로 content 래퍼 스타일을 다르게 적용한다.
  // (graduation-progress: 콘텐츠 자체 패딩이 있어 content-padding 제외 + 독립 스크롤 / delete: 추가 하단 여백 제외)
  const contentClassName = (): string => {
    switch (pathname) {
      case ROUTES.MPA.GRADUATION_PROGRESS:
        return styles.contentScroll;
      case ROUTES.MPA.DELETE:
        return styles.contentPlain;
      case ROUTES.MPA.LECTURE_EVALUATION:
        return styles.contentFull;
      default:
        return styles.content;
    }
  };

  const renderTopbar = (): ReactNode => {
    switch (pathname) {
      case ROUTES.MPA.GRADUATION_PROGRESS:
        // 웹 졸업요건과 동일한 동적 제목("{학번} {학부} 졸업요건") + 뒤로가기.
        return <GraduationNavigationHeader />;
      case ROUTES.MPA.ME:
        return <TopNavigation.Preset title="설정" type="back" onNavigationClick={() => router.back()} />;
      case ROUTES.MPA.DELETE:
        // 탈퇴 확인 페이지. < 는 /mpa/me 로 복귀 (웹 /delete 와 동일한 제목/뒤로가기).
        return <TopNavigation.Preset title="탈퇴하기" type="back" onNavigationClick={() => router.back()} />;
      case ROUTES.MPA.RESYNC_LOGIN:
        return <TopNavigation.Preset title="" type="back" onNavigationClick={goHome} />;
      default:
        return null;
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        {renderTopbar()}
        <div className={contentClassName()}>{children}</div>
      </div>
    </ProtectedRoute>
  );
}
