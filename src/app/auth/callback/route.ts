import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getCookie } from 'cookies-next';
import { getKakaoToken } from '@/lib/auth/kakao';
import { signInWithSupabase } from '@/lib/auth/supabase';
import { AuthError } from '@/lib/error';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const returnedState = searchParams.get('state');

  if (!code || !returnedState) {
    return NextResponse.redirect(`${origin}`);
  }
  try {
    /**
     * example: https://www.npmjs.com/package/cookies-next
     */
    const state = await getCookie('state', { cookies });

    if (!state || state !== returnedState) {
      throw new AuthError('Invalid state parameter.');
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? origin;
    const redirectUri = `${baseUrl}/auth/callback`;

    const idToken = await getKakaoToken(code, redirectUri);
    await signInWithSupabase(idToken);

    return NextResponse.redirect(`${origin}/auth/callback`);
  } catch (error) {
    console.log('error', error);
    const errorCode = error instanceof AuthError ? error.message : 'UNKNOWN_ERROR';
    return NextResponse.redirect(`${origin}/login?error=${errorCode}`);
  }
}
