export const API_BASE_URL = process.env.DEV_SERVER_URL ?? 'http://localhost:8080';
export const NEXT_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

export const KAKAO_JS_KEY = process.env.NEXT_PUBLIC_JAVASCRIPT_KEY!;
export const KAKAO_REST_API_KEY = process.env.REST_API_KEY!;
export const KAKAO_CLIENT_SECRET = process.env.CLIENT_SECRET!;

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const SUPABASE_PROJECT_ID = process.env.SUPABASE_PROJECT_ID!;
export const SESSION_SECRET = process.env.SESSION_SECRET!;

export const LAMBDA_DEV_URL = process.env.LAMBDA_DEV_URL ?? '';
export const AWS_SCRAPER_URL = process.env.AWS_URL ?? '';

export const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN ?? '';
export const SENTRY_AUTH_TOKEN = process.env.SENTRY_AUTH_TOKEN ?? '';

export const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL ?? '';
export const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN ?? '';

export const TEST_TOKEN = process.env.TEST_TOKEN ?? '';
export const TEST_TOKEN2 = process.env.TEST_TOKEN2 ?? '';

export const PORT = Number(process.env.PORT) || 3000;
