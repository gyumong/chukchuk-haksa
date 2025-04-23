import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getKakaoToken } from '@/lib/auth/kakao';
import { AuthError } from '@/lib/error';
import { signInWithBackend } from '@/lib/auth/signin';
import { getRedirectUri } from '@/lib/auth/client';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const returnedState = searchParams.get('state');

  if (!code || !returnedState) {
    return NextResponse.redirect(`${origin}`);
  }
  try {
    const cookieStore = await cookies();
    const state = cookieStore.get('state')?.value;
    const nonce = cookieStore.get('nonce')?.value;

    if (!state || state !== returnedState) {
      throw new AuthError('Invalid state parameter.');
    }

    if (!nonce) {
      throw new AuthError('Nonce is not found.');
    }

    const successRedirectUri = getRedirectUri();
    const idToken = await getKakaoToken(code, successRedirectUri);
    
    await signInWithBackend(idToken, nonce);
    
    return NextResponse.redirect(successRedirectUri);;
  } catch (error) {
    console.log('error', error);
    const fallbackRedirectUri = `${origin}/login`;
    const errorCode = error instanceof AuthError ? error.message : 'UNKNOWN_ERROR';
    return NextResponse.redirect(`${fallbackRedirectUri}?error=${errorCode}`);
  }
}
