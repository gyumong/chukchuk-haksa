import { NextResponse } from 'next/server';
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
    const { accessToken, refreshToken, isPortalLinked } = await authService.login(idToken, nonce, 'KAKAO');

    if (typeof isPortalLinked !== 'boolean' || !refreshToken) {
      throw new AuthError('User is missing or malformed.');
    }

    // 탈퇴 직후 재로그인이면 백엔드가 isPortalLinked:true 를 돌려주더라도 (soft-delete 상태에서
    // portal_link 관계가 잔존하는 케이스) 학교 연동 funnel 을 다시 태우도록 false 로 강제한다.
    // 마커는 /api/users/delete 성공 직후 클라이언트가 set: src/app/(setting)/delete/page.tsx
    const postDeleteMarker = await getCookieValue('cchaksa_post_delete');
    const effectiveIsPortalLinked = postDeleteMarker === '1' ? false : isPortalLinked;

    const session = await getSession();
    session.accessToken = accessToken;
    session.refreshToken = refreshToken;
    session.isPortalLinked = effectiveIsPortalLinked;
    await session.save();

    await deleteCookie('state');
    await deleteCookie('nonce');
    if (postDeleteMarker !== null) {
      await deleteCookie('cchaksa_post_delete');
    }

    const nextPath = getRedirectPathForUser({ isPortalLinked: effectiveIsPortalLinked });
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
