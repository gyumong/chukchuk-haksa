// 클라이언트 예외를 Sentry 와 별개로 Discord 웹훅(서버 프록시 /api/client-error)으로도 전송한다.
// fire-and-forget — 절대 throw 하지 않으며, 동일 에러 폭주를 막기 위해 시그니처 기반으로 throttle 한다.
// 웹훅 URL 은 서버(/api/client-error)에서만 사용 — 클라이언트엔 노출되지 않는다.

const DEDUPE_WINDOW_MS = 60_000;
const MAX_TRACKED = 50;
const recentlySent = new Map<string, number>();

export interface ClientErrorContext {
  /** 발생 위치/종류 식별용 (예: 'api', 'window.onerror'). */
  scope?: string;
  [key: string]: unknown;
}

function toError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  try {
    return new Error(JSON.stringify(error));
  } catch {
    return new Error('Unknown non-serializable error');
  }
}

// 같은 시그니처(이름+메시지)는 1분에 1회만 전송 — Discord rate limit/스팸 방지.
function shouldSend(signature: string): boolean {
  const now = Date.now();
  const last = recentlySent.get(signature);
  if (last !== undefined && now - last < DEDUPE_WINDOW_MS) {
    return false;
  }
  recentlySent.set(signature, now);
  if (recentlySent.size > MAX_TRACKED) {
    const oldest = recentlySent.keys().next().value;
    if (oldest !== undefined) {
      recentlySent.delete(oldest);
    }
  }
  return true;
}

export function reportClientError(error: unknown, context?: ClientErrorContext): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    const err = toError(error);
    const name = err.name || 'Error';
    const message = err.message || 'Unknown error';
    const signature = `${name}:${message}`.slice(0, 200);
    if (!shouldSend(signature)) {
      return;
    }

    const payload = {
      name,
      message: message.slice(0, 1000),
      stack: (err.stack ?? '').slice(0, 1500),
      context: context ?? {},
      url: window.location.href,
      userAgent: navigator.userAgent,
      ts: new Date().toISOString(),
    };

    void fetch('/api/client-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // 보고 전송 실패는 무시 — 에러 보고가 앱 흐름을 깨면 안 됨.
    });
  } catch {
    // 어떤 경우에도 throw 하지 않는다.
  }
}
