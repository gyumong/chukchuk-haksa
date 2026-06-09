export const ROUTES = {
  LANDING: '/',
  MAIN: '/main',
  FUNNEL: {
    AGREEMENT: '/agreement',
    COMPLETE: '/complete',
    PORTAL_LOGIN: '/portal-login',
    SCRAPING: '/scraping',
    TARGET_SCORE: '/target-score',
  },
  AUTH: {
    CALLBACK: '/auth/callback',
  },
  RESYNC: {
    LOGIN: '/resync/login',
    SCRAPING: '/resync/scraping',
  },
  ACADEMIC_DETAIL: '/academic-detail',
  GRADUATION_PROGRESS: '/graduation-progress',
  SETTING: '/setting',
  DELETE: '/delete',
  // /mpa/* 는 네이티브 앱이 WebView로 임베드하는 라우트로, 전부 Next.js 페이지로 실재하며
  // 네이티브가 webview 로 직접 로드한다. (HOME/ME, GRADUATION_PROGRESS,
  // RESYNC_LOGIN/RESYNC_SCRAPING, PORTAL_LOGIN/PORTAL_LOGIN_SCRAPING, DELETE)
  // DELETE 는 탈퇴 확인 페이지로, 버튼이 'withdraw' 브릿지 이벤트를 송출해 실제 탈퇴는 네이티브가 수행한다.
  MPA: {
    HOME: '/mpa/home',
    ME: '/mpa/me',
    GRADUATION_PROGRESS: '/mpa/graduation-progress',
    RESYNC_LOGIN: '/mpa/resync/login',
    RESYNC_SCRAPING: '/mpa/resync/scraping',
    PORTAL_LOGIN: '/mpa/portal-login',
    PORTAL_LOGIN_SCRAPING: '/mpa/portal-login/scraping',
    DELETE: '/mpa/delete',
  },
} as const;
