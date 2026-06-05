import type { AuthStrategy, SessionState } from './types';

// 개발 전용 mock 전략. accessToken 하나만으로 보호 페이지/Bearer 경로를 테스트하기 위함.
// 사용: URL 에 ?mockAccessToken=<token> (옵션 &mockPortalLinked=false) 를 붙여 진입.
//   - 토큰은 sessionStorage 에 저장돼 SPA 네비게이션·새로고침 동안 유지된다.
//   - ?mockAccessToken=clear (또는 빈 값) 으로 해제. clearAuth() 로도 해제된다.
// 쿠키·카카오 로그인·네이티브 주입이 전혀 필요 없다. selectStrategy() 의 NODE_ENV 가드 덕분에
// 프로덕션 번들에는 포함되지 않는다(dead-code elimination).

const TOKEN_PARAM = 'mockAccessToken';
const PORTAL_PARAM = 'mockPortalLinked';
const TOKEN_KEY = '__dev_mock_access_token__';
const PORTAL_KEY = '__dev_mock_portal_linked__';

function syncFromQuery(): void {
  const params = new URLSearchParams(window.location.search);
  if (!params.has(TOKEN_PARAM)) {
    return;
  }
  const token = params.get(TOKEN_PARAM) ?? '';
  if (token === '' || token === 'clear') {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(PORTAL_KEY);
    return;
  }
  sessionStorage.setItem(TOKEN_KEY, token);
  const portal = params.get(PORTAL_PARAM);
  if (portal !== null) {
    sessionStorage.setItem(PORTAL_KEY, portal);
  }
}

export function getDevMockStrategy(): AuthStrategy | null {
  if (typeof window === 'undefined') {
    return null;
  }
  syncFromQuery();
  const token = sessionStorage.getItem(TOKEN_KEY);
  if (!token) {
    return null;
  }
  // hydrate/refreshTransport 는 호출 시점마다 sessionStorage 를 읽어 clear() 이후 stale 토큰 노출을 방지한다.
  const readState = (): SessionState | null => {
    const currentToken = sessionStorage.getItem(TOKEN_KEY);
    if (!currentToken) {
      return null;
    }
    const portalRaw = sessionStorage.getItem(PORTAL_KEY);
    const isPortalLinked = portalRaw === null ? true : portalRaw !== 'false';
    return { accessToken: currentToken, isPortalLinked, analyticsId: null };
  };

  return {
    hydrate: async () => readState(),
    clear: async () => {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(PORTAL_KEY);
    },
    // 호출 시점의 토큰 반환(401 시 같은 토큰; httpConfig 는 1회만 재시도하므로 루프 없음).
    refreshTransport: async () => sessionStorage.getItem(TOKEN_KEY),
  };
}
