import { AuthError } from '@/lib/error';
import { extractCookieValue } from '@/lib/utils/cookies';
import { setAccessToken } from '@/lib/auth/token';
import { API_BASE_URL } from '@/config/env';

export async function signInWithBackend(idToken: string, nonce: string) {

  if (!nonce) {
    throw new AuthError('Nonce is not found.');
  }

  const response = await fetch(`${API_BASE_URL}/api/users/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: idToken, nonce }),
    credentials: 'include',
  });

  if (!response.ok) {
    throw new AuthError('Failed to sign in with Kakao.');
  }

  // Set-Cookie 헤더에서 access_token 추출
  const setCookie = response.headers.get('set-cookie');
  const token = setCookie ? extractCookieValue(setCookie, 'accessToken') : null;

  if (!token) {
    throw new AuthError('access_token not found in response headers.');
  }

  await setAccessToken(token); // 저장 (with secure, httpOnly, etc.)

  const data = await response.json();

  return { data };
}