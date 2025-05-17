import { NextResponse } from 'next/server';
import { getRedirectUri } from '@/lib/auth/client';
import { getKakaoToken } from '@/lib/auth/kakao';
import { getRedirectPathForUser } from '@/lib/auth/redirect';
import { signInWithBackend } from '@/lib/auth/signin';
import { AuthError } from '@/lib/error';
import { getCookieValue } from '@/lib/utils/cookies';

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
    const user = await signInWithBackend(idToken, nonce);

    const isPortalLinked = user?.isPortalLinked;
    const accessToken = user?.accessToken ?? '';

    if (isPortalLinked === undefined) {
      throw new AuthError('User is missing or malformed.');
    }

    const nextPath = getRedirectPathForUser({ isPortalLinked });

    const url = new URL('/auth/success', origin);
    url.searchParams.set('token', accessToken);
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
