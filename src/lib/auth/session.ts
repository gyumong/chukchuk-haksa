import type { SessionOptions } from 'iron-session';
import { ENV } from '@/config/environment';

export interface SessionData {
  username: string;
  password: string;
}

export const sessionOptions: SessionOptions = {
  cookieName: 'session',
  password: ENV.SESSION_SECRET,
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600, // 10분
  },
};

export const defaultSession: SessionData = {
  username: '',
  password: '',
};
