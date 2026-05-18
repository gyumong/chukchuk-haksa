import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getApiBaseUrl } from '@/config/environment';

export const dynamic = 'force-dynamic';

const PORTAL_LINKED_PROBE_TIMEOUT_MS = 3_000;

// POST /api/session 은 보안상 isPortalLinked=false 로 강제 저장한다.
// 실제 연동 상태는 백엔드만 알기 때문에, hydrate 시점(GET)에 backend profile 을
// 한 번 probe 해서 200 이면 세션을 true 로 승격한다. 한 번 승격되면 이후 호출은
// 추가 백엔드 호출 없이 즉시 응답한다.
async function probePortalLinked(accessToken: string): Promise<boolean> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PORTAL_LINKED_PROBE_TIMEOUT_MS);
  try {
    const response = await fetch(`${getApiBaseUrl()}/api/student/profile`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
      cache: 'no-store',
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  if (session.isPortalLinked !== true) {
    const linked = await probePortalLinked(session.accessToken);
    if (linked) {
      session.isPortalLinked = true;
      await session.save();
    }
  }

  return NextResponse.json({
    accessToken: session.accessToken,
    isPortalLinked: session.isPortalLinked ?? false,
  });
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}

interface SessionExchangeBody {
  accessToken?: unknown;
  refreshToken?: unknown;
}

// 네이티브 앱이 보유한 ac/re 토큰을 cchaksa_session 쿠키로 익스체인지.
// 시퀀스: docs/mpa-school-link-handoff.md
// isPortalLinked 는 요청 바디에서 받지 않고 false 로 강제. 클라이언트 임의 값으로 세션 승격되는 경로 차단.
// 실제 연동 상태는 GET /api/session 의 backend profile probe 또는 재로그인(auth callback) 으로 갱신됨.
// TODO(backend): 토큰 진위 검증 엔드포인트가 추가되면 sealData 직전 호출해 위조 토큰 차단.
export async function POST(request: Request) {
  let body: SessionExchangeBody;
  try {
    body = (await request.json()) as SessionExchangeBody;
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const { accessToken, refreshToken } = body;

  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    return NextResponse.json({ error: 'MISSING_ACCESS_TOKEN' }, { status: 400 });
  }
  if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
    return NextResponse.json({ error: 'MISSING_REFRESH_TOKEN' }, { status: 400 });
  }

  const session = await getSession();
  session.accessToken = accessToken;
  session.refreshToken = refreshToken;
  session.isPortalLinked = false;
  await session.save();

  return NextResponse.json({ ok: true, isPortalLinked: false });
}
