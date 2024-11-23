import { AuthError } from '@/lib/error';
import { createClient } from '@/lib/supabase/server';

export async function signInWithSupabase(idToken: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithIdToken({
    provider: 'kakao',
    token: idToken,
  });

  if (error || !data) {
    console.error('Supabase sign-in error:', error);
    throw new AuthError('Supabase sign in failed.');
  }

  return data;
}
