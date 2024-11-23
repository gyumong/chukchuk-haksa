import { NextResponse } from 'next/server';
import { AuthError } from '@/lib/error';
import { getKakaoToken } from '@/lib/auth/kakao';
import { signInWithSupabase } from '@/lib/auth/supabase';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const next = searchParams.get('next') ?? `${origin}`;
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/login`);
  }
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? origin;
    const redirectUri = `${baseUrl}/auth/callback`;

    const idToken = await getKakaoToken(code, redirectUri);
    await signInWithSupabase(idToken);

    return NextResponse.redirect(next);
  } catch (error) {
    const errorCode = error instanceof AuthError ? error.message : 'UNKNOWN_ERROR';
    return NextResponse.redirect(`${origin}/login?error=${errorCode}`);
  }
}
