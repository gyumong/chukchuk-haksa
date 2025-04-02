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
} as const;
