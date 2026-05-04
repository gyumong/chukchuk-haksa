import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getSession();

  if (!session.accessToken) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
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
  isPortalLinked?: unknown;
}

// 네이티브 앱이 보유한 ac/re 토큰을 cchaksa_session 쿠키로 익스체인지.
// docs/mpa-school-link-handoff.md 의 시퀀스 참조.
// TODO(backend): 백엔드에 토큰 진위 검증 엔드포인트가 추가되면 여기서 호출해 위조 토큰 차단.
// TODO(mobile-handshake): 네이티브 전용 요청 식별 방식(전용 헤더 또는 Origin) 합의 후 검증 추가.
export async function POST(request: Request) {
  let body: SessionExchangeBody;
  try {
    body = (await request.json()) as SessionExchangeBody;
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 });
  }

  const { accessToken, refreshToken, isPortalLinked } = body;

  if (typeof accessToken !== 'string' || accessToken.length === 0) {
    return NextResponse.json({ error: 'MISSING_ACCESS_TOKEN' }, { status: 400 });
  }
  if (typeof refreshToken !== 'string' || refreshToken.length === 0) {
    return NextResponse.json({ error: 'MISSING_REFRESH_TOKEN' }, { status: 400 });
  }

  const session = await getSession();
  session.accessToken = accessToken;
  session.refreshToken = refreshToken;
  session.isPortalLinked = typeof isPortalLinked === 'boolean' ? isPortalLinked : false;
  await session.save();

  return NextResponse.json({
    ok: true,
    isPortalLinked: session.isPortalLinked,
  });
}
