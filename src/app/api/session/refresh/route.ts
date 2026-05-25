import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { refreshTokensFromBackend } from '@/lib/auth/refreshToken';

export const dynamic = 'force-dynamic';

export async function POST() {
  const session = await getSession();

  if (!session.refreshToken) {
    return NextResponse.json({ error: 'NO_REFRESH_TOKEN' }, { status: 401 });
  }

  const refreshed = await refreshTokensFromBackend(session.refreshToken);

  if (!refreshed) {
    // 백엔드 거부·타임아웃·형식 오류 모두 회복 불가로 보고 세션 폐기.
    // 클라이언트가 SESSION_EXPIRED 응답을 받아 로그아웃 흐름으로 진입한다.
    session.destroy();
    return NextResponse.json({ error: 'REFRESH_FAILED' }, { status: 401 });
  }

  session.accessToken = refreshed.accessToken;
  session.refreshToken = refreshed.refreshToken;
  await session.save();

  return NextResponse.json({ accessToken: refreshed.accessToken });
}
