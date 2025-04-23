import type { CookieOptions } from '@/types';
import { cookies } from 'next/headers';

export async function getCookieValue(key: string): Promise<string | null> {
  return (await cookies()).get(key)?.value ?? null;
}

export async function setCookie(key: string, value: string, options?: CookieOptions) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    path: '/',
    sameSite: 'lax',
    ...options,
  });
}

export async function deleteCookie(key: string) {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}


/**
 * Set-Cookie 응답 헤더 문자열에서 특정 쿠키 값을 추출
 * 사용하는 쪽의 책임을 지게끔 Null 허용함
 */

export function extractCookieValue(setCookieHeader: string, cookieName: string): string | null {
  const parts = setCookieHeader.split(/,(?=\s*\w+=)/); // name=으로 시작하는 부분만 split

  for (const part of parts) {
    const [pair] = part.split(';'); // 첫 번째 key=value
    const [key, value] = pair.trim().split('=');
    if (key === cookieName) {
      return value;
    }
  }

  return null;
}