import { ROUTES } from '@/constants/routes';

export function getRedirectPathForUser(user: { isPortalLinked: boolean }): string {
  return user.isPortalLinked ? ROUTES.MAIN : ROUTES.FUNNEL.PORTAL_LOGIN;
}
