import { ACCESS_TOKEN_KEY, PORTAL_LINKED_KEY, REFRESH_TOKEN_KEY } from '@/constants';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function deleteAccessToken() {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // 쿠키에서 refreshToken 가져오기
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === REFRESH_TOKEN_KEY) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export function setRefreshToken(token: string) {
  if (typeof window === 'undefined') {
    return;
  }

  // 쿠키에 refreshToken 설정
  document.cookie = `${REFRESH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; sameSite=lax`;
}

export function deleteRefreshToken() {
  if (typeof window === 'undefined') {
    return;
  }

  // 쿠키에서 refreshToken 제거
  document.cookie = `${REFRESH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export function getPortalLinked(): boolean | null {
  if (typeof window === 'undefined') {
    return null;
  }
  const value = sessionStorage.getItem(PORTAL_LINKED_KEY);
  return value !== null ? JSON.parse(value) : null;
}

export function setPortalLinked(isLinked: boolean) {
  console.log('setPortalLinked', isLinked);
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.setItem(PORTAL_LINKED_KEY, JSON.stringify(isLinked));
}

export function deletePortalLinked() {
  if (typeof window === 'undefined') {
    return;
  }
  sessionStorage.removeItem(PORTAL_LINKED_KEY);
}
