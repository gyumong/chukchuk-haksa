export const ROUTES = {
  LANDING: '/',
  MAIN: '/main',
  FUNNEL: {
    AGREEMENT: '/agreement',
    COMPLETE: '/complete',
    PORTAL_LOGIN: '/portal-login',
    SCRAPING: '/scraping',
    TARGET_SCORE: '/target-score',
    FOREIGN_LANGUAGE_CERT: '/foreign-language-cert',
  },
  AUTH: {
    CALLBACK: '/auth/callback',
  },
  RESYNC: {
    LOGIN: '/resync/login',
    SCRAPING: '/resync/scraping',
  },
  ACADEMIC_DETAIL: '/academic-detail',
  LECTURE_EVALUATION: '/lecture-evaluation',
  GRADUATION_PROGRESS: '/graduation-progress',
  SETTING: '/setting',
  DELETE: '/delete',
  // /mpa/* 는 네이티브 앱이 WebView로 임베드하는 라우트로, 전부 Next.js 페이지로 실재하며
  // 네이티브가 webview 로 직접 로드한다. (HOME/ME, GRADUATION_PROGRESS,
  // RESYNC_LOGIN/RESYNC_SCRAPING, PORTAL_LOGIN/PORTAL_LOGIN_SCRAPING, DELETE)
  // DELETE 는 탈퇴 확인 페이지. 버튼이 웹에서 실제 백엔드 탈퇴(DELETE /api/users/delete)를 수행한 뒤
  // 'withdraw' 브릿지로 네이티브에 '탈퇴 완료'를 통지하면, 네이티브가 웹뷰 dismiss·로그아웃 후처리를 한다.
  // (삭제는 웹이 1회만 수행 — 네이티브가 다시 DELETE 를 호출하지 않도록 한다.)
  MPA: {
    HOME: '/mpa/home',
    ME: '/mpa/me',
    GRADUATION_PROGRESS: '/mpa/graduation-progress',
    RESYNC_LOGIN: '/mpa/resync/login',
    RESYNC_SCRAPING: '/mpa/resync/scraping',
    PORTAL_LOGIN: '/mpa/portal-login',
    PORTAL_LOGIN_SCRAPING: '/mpa/portal-login/scraping',
    LECTURE_EVALUATION: '/mpa/lecture-evaluation',
    DELETE: '/mpa/delete',
  },
} as const;
