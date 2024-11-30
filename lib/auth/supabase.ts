import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { AuthError } from '@/lib/error';
import { createClient } from '@/lib/supabase/server';

async function signInWithSupabase(idToken: string) {
  const supabase = createClient();
  const nonce = await getCookie('nonce', { cookies });

  if (!nonce) {
    throw new AuthError('Nonce is not found.');
  }
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'kakao',
    token: idToken,
    nonce,
  });

  if (error || !data) {
    console.error('Supabase sign-in error:', error);
    throw new AuthError('Supabase sign in failed.');
  }

  return data;
}

export { signInWithSupabase };