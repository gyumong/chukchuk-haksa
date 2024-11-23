import { AuthError } from '@/lib/error';

export function kakaoLogin(redirectUri?: string) {
  if (!window?.Kakao || !window.Kakao.Auth) {
    throw new AuthError('Kakao SDK is not loaded or initialized.');
  }

  const uri = redirectUri ?? new URL('/auth/callback', window.location.origin).toString();
  window.Kakao.Auth.authorize({ redirectUri: uri, prompt: 'login' });
}

export async function getKakaoToken(code: string, redirectUri: string): Promise<string> {
  const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  const REST_API_KEY = process.env.REST_API_KEY!;
  const CLIENT_SECRET = process.env.CLIENT_SECRET!;

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: REST_API_KEY,
      redirect_uri: redirectUri,
      code,
      client_secret: CLIENT_SECRET,
    }),
  });

  if (!response.ok) {
    throw new AuthError(`Kakao token request failed: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.id_token) {
    throw new AuthError('ID token not found in Kakao response.');
  }

  return data.id_token;
}
