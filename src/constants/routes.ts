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
  // HOME/ME, RESYNC_LOGIN/RESYNC_SCRAPING 은 Next.js 페이지로 존재하고,
  // 나머지 URL (GRADUATION_PROGRESS, DELETE 등) 은 JS bridge 로 전달되어
  // 네이티브 측이 해석한다.
  MPA: {
    HOME: '/mpa/home',
    ME: '/mpa/me',
    GRADUATION_PROGRESS: '/mpa/graduation-progress',
    RESYNC_LOGIN: '/mpa/resync/login',
    RESYNC_SCRAPING: '/mpa/resync/scraping',
    DELETE: '/mpa/delete',
  },
} as const;
