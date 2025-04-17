import type { SessionOptions } from 'iron-session';

export interface SessionData {
  username: string;
  password: string;
}

export const sessionOptions: SessionOptions = {
  cookieName: 'session',
  password: process.env.SESSION_SECRET!,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10분
  },
};

export const defaultSession: SessionData = {
  username: '',
  password: '',
};
