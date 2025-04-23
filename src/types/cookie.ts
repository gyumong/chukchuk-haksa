export interface CookieOptions {
    expires?: Date;
    maxAge?: number;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: boolean | 'lax' | 'strict' | 'none';
    priority?: 'low' | 'medium' | 'high';
    encode?: (value: string) => string;
    partitioned?: boolean;
  }