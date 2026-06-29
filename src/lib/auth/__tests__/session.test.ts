import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// '*' 8개 파트를 갖지만 mac prefix 가 'Fe26.2' 가 아니라, iron-webcrypto 가 'Wrong mac prefix' 를
// throw 하는 손상 봉인. 이 에러는 iron-session unsealData 의 흡수 allowlist(Expired seal 등 4개)에
// 없어 그대로 전파되며, 라우트 핸들러에서 500 을 유발하던 실제 케이스다. (앱 webview 의 stale cookie)
const CORRUPT_SEAL = 'Xx26.2*1*aaa*bbb*ccc*111*ddd*eee';

const hoisted = vi.hoisted(() => ({
  store: null as null | {
    get: (name: string) => { name: string; value: string } | undefined;
    set: (name: string, value: string) => void;
    delete: (name: string) => void;
  },
  // resetModules 로 매 테스트마다 session 모듈을 재임포트해도 동일 인스턴스를 유지하기 위해 hoisted 에 둔다.
  captureException: vi.fn(),
}));

vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve(hoisted.store),
}));

vi.mock('@sentry/nextjs', () => ({
  captureException: hoisted.captureException,
}));

function makeCookieStore(initial: Record<string, string>) {
  const map = new Map(Object.entries(initial));
  return {
    get: (name: string) => (map.has(name) ? { name, value: map.get(name) as string } : undefined),
    set: (name: string, value: string) => {
      map.set(name, value);
    },
    delete: (name: string) => {
      map.delete(name);
    },
  };
}

describe('getSession', () => {
  beforeEach(() => {
    vi.resetModules();
    hoisted.captureException.mockClear();
    // iron-session password 는 32자 이상이어야 getIronSession 이 throw 하지 않는다.
    vi.stubEnv('SESSION_SECRET', 'test-session-secret-at-least-32-characters');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('손상된 봉인 쿠키를 만나면 throw 없이 빈 세션을 반환하고 손상 쿠키를 제거한다', async () => {
    const store = makeCookieStore({ cchaksa_session: CORRUPT_SEAL });
    hoisted.store = store;

    const { getSession, SESSION_COOKIE_NAME } = await import('../session');

    // 핵심 회귀: 예외가 새어 나가 500 이 되면 안 된다.
    const session = await getSession();

    expect(session.accessToken).toBeUndefined();
    // 손상 쿠키가 제거돼 다음 요청이 같은 500 루프에 빠지지 않는다.
    expect(store.get(SESSION_COOKIE_NAME)).toBeUndefined();
    // 복구 경로의 관측성: 봉인 해제 실패를 Sentry 로 보고했는지 검증.
    expect(hoisted.captureException).toHaveBeenCalledTimes(1);
  });

  it('쿠키가 없으면 빈 세션을 반환한다', async () => {
    hoisted.store = makeCookieStore({});

    const { getSession } = await import('../session');
    const session = await getSession();

    expect(session.accessToken).toBeUndefined();
  });
});
