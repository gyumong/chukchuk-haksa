import { NextResponse } from 'next/server';
import { ENV } from '@/config/environment';
import { getSession } from '@/lib/auth/session';

const NATIVE_BRIDGE_SECRET_HEADER = 'x-native-bridge-secret';

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
//
// 보안 게이트:
//   1. NATIVE_SESSION_EXCHANGE_SECRET 미설정 시 503 (엔드포인트 비활성).
//   2. 요청 헤더 x-native-bridge-secret 가 환경변수와 일치해야 함 (모바일과 사전 공유).
// 게이트는 일반 브라우저/외부 호출의 위조 우회를 막기 위한 것이며, 토큰 자체의 진위 검증은 별도.
// TODO(backend): 백엔드에 토큰 진위 검증 엔드포인트가 추가되면 sealData 직전 호출해 위조 토큰 차단.
export async function POST(request: Request) {
  const expectedSecret = ENV.NATIVE_SESSION_EXCHANGE_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: 'NOT_CONFIGURED' }, { status: 503 });
  }

  const providedSecret = request.headers.get(NATIVE_BRIDGE_SECRET_HEADER);
  if (providedSecret !== expectedSecret) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

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
