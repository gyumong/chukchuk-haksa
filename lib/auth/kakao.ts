import { setCookie } from 'cookies-next';
import { AuthError } from '@/lib/error';
import { generateRandomNonce, generateRandomString, hashNonce } from '.';

function initializeKakao() {
  if (!window.Kakao) {
    throw new Error('Kakao SDK is not loaded.');
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY!);
  }
}

function cleanupKakao() {
  if (window.Kakao?.isInitialized()) {
    window.Kakao.cleanup();
  }
}

async function kakaoLogin(redirectUri?: string) {
  if (!window?.Kakao || !window.Kakao.Auth) {
    throw new AuthError('Kakao SDK is not loaded or initialized.');
  }

  const state = generateRandomString(32);
  const nonce = generateRandomNonce(); // 무작위 nonce 생성
  const hashedNonce = await hashNonce(nonce);

  setCookie('nonce', nonce);
  setCookie('state', state);
  const uri = redirectUri ?? new URL('/auth/callback', window.location.origin).toString();

  // 카카오 로그인 scope 옵션 내부적인 캐싱이 적용되어 있는지?
  /**
   * api docs: https://developers.kakao.com/sdk/reference/js/release/Kakao.Auth.html
   */

  window.Kakao.Auth.authorize({
    redirectUri: uri,
    prompt: 'login',
    scope: 'account_email profile_image profile_nickname talk_message openid',
    state,
    nonce: hashedNonce,

  });
}

async function getKakaoToken(code: string, redirectUri: string): Promise<string> {
  const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
  const REST_API_KEY = process.env.REST_API_KEY!;
  const CLIENT_SECRET = process.env.CLIENT_SECRET!;

  const response = await fetch(KAKAO_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      'cache-control': 'no-store',
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

export { initializeKakao, cleanupKakao, kakaoLogin, getKakaoToken };
