import { ACCESS_TOKEN_KEY } from '@/constants';

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
