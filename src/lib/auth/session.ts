import { cookies } from 'next/headers';
import { getIronSession, type SessionOptions } from 'iron-session';
import { ENV } from '@/config/environment';

export const SESSION_COOKIE_NAME = 'cchaksa_session';

export interface SessionData {
  accessToken?: string;
  refreshToken?: string;
  isPortalLinked?: boolean;
  // Amplitude setUserId 에 그대로 전달되는 사용자 PK UUID. 백엔드 SignInResponse 에서 수신.
  // 백엔드 실제 키 확정 후 data-contracts 매핑만 조정. 키 없으면 undefined 로 graceful degrade.
  analyticsId?: string;
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
