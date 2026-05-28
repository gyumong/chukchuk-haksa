import { NextResponse } from 'next/server';
import { fetchAnalyticsIdFromBackend } from '@/lib/auth/analyticsId';
import { getRedirectUri } from '@/lib/auth/client';
import { getKakaoToken } from '@/lib/auth/kakao';
import { getRedirectPathForUser } from '@/lib/auth/redirect';
import { getSession } from '@/lib/auth/session';
import { authService } from '@/features/auth/services/authService';
import { AuthError } from '@/lib/error';
import { getCookieValue, deleteCookie } from '@/lib/utils/cookies';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const returnedState = searchParams.get('state');

  try {
    const state = await getCookieValue('state');
    const nonce = await getCookieValue('nonce');

    if (!code || !state || state !== returnedState || !nonce) {
      throw new AuthError('Invalid login attempt.');
    }

    const redirectUri = getRedirectUri();

    const idToken = await getKakaoToken(code, redirectUri);
    const { accessToken, refreshToken, isPortalLinked } = await authService.login(
      idToken,
      nonce,
      'KAKAO'
    );

    if (typeof isPortalLinked !== 'boolean' || !refreshToken) {
      throw new AuthError('User is missing or malformed.');
    }

    // analyticsId 는 별도 엔드포인트(`GET /api/users/analytics-id`)에서 fetch.
    // 실패·타임아웃 시 null — wire-up 자동 skip, 익명 추적으로 graceful degrade.
    const analyticsId = await fetchAnalyticsIdFromBackend(accessToken);

    const session = await getSession();
    session.accessToken = accessToken;
    session.refreshToken = refreshToken;
    session.isPortalLinked = isPortalLinked;
    // 명시적 설정/해제 — 이전 사용자의 analyticsId 가 남는 leak 방지 (재로그인 시 다른 계정).
    if (analyticsId) {
      session.analyticsId = analyticsId;
    } else {
      delete session.analyticsId;
    }
    await session.save();

    await deleteCookie('state');
    await deleteCookie('nonce');

    const nextPath = getRedirectPathForUser({ isPortalLinked });
    const url = new URL('/auth/success', origin);
    url.searchParams.set('redirect', nextPath);
    return NextResponse.redirect(url);
  } catch (error) {
    console.error(error);
    const fallback = `${origin}/?error=${encodeURIComponent(
      error instanceof AuthError ? error.message : 'UNKNOWN_ERROR'
    )}`;
    return NextResponse.redirect(fallback);
  }
}
