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
  ACADEMIC_DETAIL: '/academic-detail',
  GRADUATION_PROGRESS: '/graduation-progress',
} as const;
