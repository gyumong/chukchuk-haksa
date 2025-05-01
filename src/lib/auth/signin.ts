import { ACCESS_TOKEN_KEY } from '@/constants';
import { setAccessToken } from '@/lib/auth/token';
import { AuthError } from '@/lib/error';
import { extractCookieValue } from '@/lib/utils/cookies';
import { userApi } from '@/shared/api';

export async function signInWithBackend(idToken: string, nonce: string) {
  if (!nonce) {
    throw new AuthError('Nonce is not found.');
  }

  const res = await userApi.signInUser(
    { id_token: idToken, nonce } // <-- body (`SignInRequest`)
  );

  // Set-Cookie 헤더에서 access_token 추출
  const setCookie = res.headers.get('set-cookie');
  const accessToken = setCookie ? extractCookieValue(setCookie, ACCESS_TOKEN_KEY) : null;

  if (!accessToken) {
    throw new AuthError('access_token not found in response headers.');
  }

  await setAccessToken(accessToken); // 저장 (with secure, httpOnly, etc.)

  return res.data?.data; // { isPortalLinked }
}
