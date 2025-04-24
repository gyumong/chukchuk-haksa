import { ACCESS_TOKEN_KEY } from '@/constants';
import { deleteCookie, getCookieValue, setCookie } from '@/lib/utils/cookies';

export async function getAccessToken(): Promise<string | null> {
  return getCookieValue(ACCESS_TOKEN_KEY);
}

export async function setAccessToken(token: string) {
  return setCookie(ACCESS_TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7일
  });
}

export async function deleteAccessToken() {
  return deleteCookie(ACCESS_TOKEN_KEY);
}
