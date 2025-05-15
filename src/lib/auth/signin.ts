import { setAccessToken } from '@/lib/auth/token';
import { AuthError } from '@/lib/error';
import { userApi } from '@/shared/api';

export async function signInWithBackend(idToken: string, nonce: string) {
  if (!nonce) {
    throw new AuthError('Nonce is not found.');
  }

  const res = await userApi.signInUser(
    { id_token: idToken, nonce } // <-- body (`SignInRequest`)
  );
  const accessToken = res.data.data?.accessToken;

  if (!accessToken) {
    throw new AuthError('access_token not found in response body.');
  }

  await setAccessToken(accessToken); // 저장 (with secure, httpOnly, etc.)

  return res.data?.data; // { isPortalLinked }
}
