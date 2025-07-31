import { ENV } from '@/config/environment';

export function getRedirectUri(path: string = '/auth/callback') {
  return `${ENV.FRONTEND_URL}${path}`;
}
