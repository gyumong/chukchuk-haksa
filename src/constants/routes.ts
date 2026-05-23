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
  // /mpa/* 는 네이티브 앱이 WebView로 임베드하는 라우트.
  // HOME/ME, GRADUATION_PROGRESS, RESYNC_LOGIN/RESYNC_SCRAPING, PORTAL_LOGIN/PORTAL_LOGIN_SCRAPING
  // 은 Next.js 페이지로 실재하며 네이티브가 webview 로 직접 로드한다.
  // DELETE 는 Next.js 페이지가 없는 JS bridge dispatch key 로, navigateNative()
  // 송출 시 네이티브가 자체 화면/액션으로 해석한다.
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
