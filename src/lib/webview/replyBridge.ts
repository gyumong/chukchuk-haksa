import { postBridgeMessage } from './bridge';

// 네이티브-소유-토큰(웹뷰) 모델의 web 측 결선.
// 봉인 쿠키 대신, 네이티브가 first-paint 전에 토큰을 주입하고(C1) refresh 를 응답형 브릿지로
// 위임받는다(C2). 계약 상세: docs/iron-session-decision.md §6, docs/mpa-school-link-handoff.md M2/M3.
//
// 주의: 아래 네이티브 API 형태(authBridge / AndroidAuth)는 네이티브 팀과 확정해야 하는 "계약"이다.
// 프로덕션에서 실제 주입/브릿지가 없으면 hasNativeAuthCapability()=false → browser 전략으로 fallback.

const NATIVE_REFRESH_TIMEOUT_MS = 10_000;

// C1: first-paint 전 네이티브가 심는 인증 글로벌.
interface NativeAuthGlobal {
  schemaVersion?: number;
  accessToken?: unknown;
  isPortalLinked?: unknown;
  analyticsId?: unknown;
}

// C2: refresh 응답 브릿지 (네이티브 주입). iOS=WKScriptMessageHandlerWithReply, Android=correlation-id 콜백.
interface NativeAuthWindow {
  __NATIVE_AUTH__?: NativeAuthGlobal;
  __nativeAuthResolve?: (corrId: string, token: string | null) => void;
  webkit?: { messageHandlers?: { authBridge?: { postMessage?: (msg: unknown) => unknown } } };
  AndroidAuth?: { requestRefresh?: (corrId: string) => void };
}

// readNativeAuth 가 돌려주는 페이로드 (features 의 SessionState 와 구조 동일이나 lib→features 의존 회피).
export interface NativeAuthPayload {
  accessToken: string | null;
  isPortalLinked: boolean | null;
  analyticsId: string | null;
}

function getNativeAuthWindow(): NativeAuthWindow | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return window as unknown as NativeAuthWindow;
}

function hasReplyBridge(w: NativeAuthWindow): boolean {
  return (
    typeof w.webkit?.messageHandlers?.authBridge?.postMessage === 'function' ||
    typeof w.AndroidAuth?.requestRefresh === 'function'
  );
}

// 네이티브-소유-토큰 경로를 탈 자격: 주입 글로벌이 존재하고 refresh 응답 브릿지도 있어야 한다.
// 둘 중 하나라도 없으면(구버전 앱/브라우저) false → 호출 측이 browser 전략(쿠키/익스체인지)으로 fallback.
export function hasNativeAuthCapability(): boolean {
  const w = getNativeAuthWindow();
  if (!w) {
    return false;
  }
  return Boolean(w.__NATIVE_AUTH__) && hasReplyBridge(w);
}

// 주입 글로벌을 SessionState 호환 페이로드로 읽는다. 없으면 null.
export function readNativeAuth(): NativeAuthPayload | null {
  const w = getNativeAuthWindow();
  const g = w?.__NATIVE_AUTH__;
  if (!g) {
    return null;
  }
  return {
    accessToken: typeof g.accessToken === 'string' ? g.accessToken : null,
    isPortalLinked: typeof g.isPortalLinked === 'boolean' ? g.isPortalLinked : null,
    analyticsId: typeof g.analyticsId === 'string' ? g.analyticsId : null,
  };
}

function extractToken(reply: unknown): string | null {
  if (typeof reply === 'string') {
    return reply.length > 0 ? reply : null;
  }
  if (reply && typeof reply === 'object' && 'accessToken' in reply) {
    const token = (reply as { accessToken?: unknown }).accessToken;
    return typeof token === 'string' && token.length > 0 ? token : null;
  }
  return null;
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('native refresh timeout')), ms);
    promise.then(
      value => {
        clearTimeout(timer);
        resolve(value);
      },
      error => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

let corrCounter = 0;
const pendingRefresh = new Map<string, (token: string | null) => void>();

function ensureAndroidResolver(w: NativeAuthWindow): void {
  if (w.__nativeAuthResolve) {
    return;
  }
  // 네이티브(Android)가 새 토큰을 들고 호출하는 단일 진입점.
  w.__nativeAuthResolve = (corrId, token) => {
    const resolve = pendingRefresh.get(corrId);
    if (resolve) {
      pendingRefresh.delete(corrId);
      resolve(typeof token === 'string' && token.length > 0 ? token : null);
    }
  };
}

// 네이티브에 access token refresh 를 위임한다. 실패/타임아웃/미지원이면 null(=refresh 실패 → 로그아웃 흐름).
// dedup 은 tokenStore.refreshAccessTokenStore 가 담당하므로 여기선 단발 요청만.
export async function requestNativeRefresh(): Promise<string | null> {
  const w = getNativeAuthWindow();
  if (!w) {
    return null;
  }

  // iOS: WKScriptMessageHandlerWithReply — postMessage 가 reply Promise 를 반환.
  const iosHandler = w.webkit?.messageHandlers?.authBridge;
  if (iosHandler && typeof iosHandler.postMessage === 'function') {
    try {
      const reply = await withTimeout(
        Promise.resolve(iosHandler.postMessage({ type: 'refresh' })),
        NATIVE_REFRESH_TIMEOUT_MS
      );
      return extractToken(reply);
    } catch {
      return null;
    }
  }

  // Android: correlation-id 콜백. requestRefresh 발사 후 __nativeAuthResolve 로 회수.
  const androidRequest = w.AndroidAuth?.requestRefresh;
  if (typeof androidRequest === 'function') {
    ensureAndroidResolver(w);
    corrCounter += 1;
    const corrId = `r${corrCounter}`;
    return new Promise<string | null>(resolve => {
      let settled = false;
      const done = (token: string | null) => {
        if (settled) {
          return;
        }
        settled = true;
        pendingRefresh.delete(corrId);
        resolve(token);
      };
      pendingRefresh.set(corrId, done);
      setTimeout(() => done(null), NATIVE_REFRESH_TIMEOUT_MS);
      try {
        androidRequest(corrId);
      } catch {
        done(null);
      }
    });
  }

  return null;
}

// C4: 로그아웃 신호(단방향). 네이티브가 keychain 클리어 + 주입 중단. 쿠키가 없으니 DELETE 불필요.
export function signalNativeLogout(): void {
  postBridgeMessage('logout');
}
