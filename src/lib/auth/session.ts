import { cookies } from 'next/headers';
import { captureException } from '@sentry/nextjs';
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

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const sessionOptions: SessionOptions = {
  password: ENV.SESSION_SECRET,
  cookieName: SESSION_COOKIE_NAME,
  // 봉인(seal) TTL 을 쿠키 maxAge 와 동일하게 명시. ttl 을 생략하면 iron-session 기본값 14일이
  // 적용돼, 쿠키는 30일간 전송되는데 봉인은 14일 뒤 만료(Expired seal → 빈 세션)되어 세션이
  // 의도(30일)보다 일찍 조용히 끊긴다. 둘을 맞춰 체감 수명을 일치시킨다.
  ttl: SESSION_MAX_AGE_SECONDS,
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  },
};

// iron-session 의 unsealData 는 'Expired seal'·'Bad hmac value'·'Cannot find password'·
// 'Incorrect number of sealed components' 4개 에러만 빈 세션으로 흡수하고, 'Wrong mac prefix'·
// 'Invalid expiration'·'Invalid password id' 등 봉인 포맷/버전/시크릿 불일치 에러는 그대로 throw 한다.
// 라우트 핸들러에는 try/catch 가 없어 이 throw 가 500 으로 새어 나가고, 손상된 cchaksa_session 쿠키가
// GET/POST(네이티브 재교환)/DELETE(로그아웃) 의 getSession() 을 모두 막아 쿠키를 덮어쓰거나 지우는
// 복구 경로까지 차단되는 자기영속 500 루프가 된다 (앱 webview 의 stale 쿠키에서 관측).
// → 봉인 해제 실패 시 손상 쿠키를 제거하고 빈 세션을 새로 발급해, 호출 측이 정상 미인증(401)/재교환
//    흐름을 타게 한다. cookieStore.delete 는 route handler/server action 에서만 허용되므로 방어적으로 감싼다.
export async function getSession() {
  const cookieStore = await cookies();
  try {
    return await getIronSession<SessionData>(cookieStore, sessionOptions);
  } catch (error) {
    captureException(error, {
      tags: { scope: 'session', action: 'getSession.unseal' },
    });
    try {
      cookieStore.delete(SESSION_COOKIE_NAME);
    } catch {
      // read-only 컨텍스트(server component 등) — 무시. 아래 재호출이 빈 세션을 돌려준다.
    }
    return getIronSession<SessionData>(cookieStore, sessionOptions);
  }
}
