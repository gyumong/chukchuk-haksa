import { cookies } from 'next/headers';
import { getIronSession, type SessionOptions } from 'iron-session';
import { ENV } from '@/config/environment';

export const SESSION_COOKIE_NAME = 'cchaksa_session';

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  isPortalLinked?: boolean;
}

export const sessionOptions: SessionOptions = {
  password: ENV.SESSION_SECRET,
  cookieName: SESSION_COOKIE_NAME,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}
