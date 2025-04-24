import { NEXT_BASE_URL } from '@/config/env';

export function getRedirectUri(path: string = '/auth/callback') {
  return `${NEXT_BASE_URL}${path}`;
}