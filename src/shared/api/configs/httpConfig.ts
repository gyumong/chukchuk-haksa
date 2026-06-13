import * as Sentry from '@sentry/nextjs';
import { getAccessTokenStore, refreshAccessTokenStore } from '@/features/auth/tokenStore';
import { getApiBaseUrl } from '@/config/environment';
import type { ApiConfig } from '../http-client';

const BASE_URL = getApiBaseUrl();

// iOS WKWebView 가 connection pool 에 남은 죽은 connection 을 재사용할 때 즉시 TCP RST 를
// 받아 `TypeError: Load failed` 를 ~10ms 만에 throw 하는 케이스가 관측됨 (Sentry CCHAKSA-56).
// AWS API Gateway 처럼 짧은 idle timeout 을 가진 백엔드에서 흔하고, Chromium 은 자체 retry
// 로 가려지지만 WebKit 은 노출됨. 재시도하면 새 connection 이 만들어져 풀의 stale entry 를
// 우회 → 일시적 NETWORK_ERROR 회복.
//
// PR #192 는 "즉시 1회 재시도" 였으나 동일 증상이 잔존(CCHAKSA-56, /mpa/home getAcademicSummary).
// 원인은 타이밍이다: 첫 fetch 가 dead socket 의 RST 로 reject 된 "직후" 곧바로 재요청하면
// NSURLSession 이 아직 그 socket 을 pool 에서 evict 하지 못해 같은(또는 또 다른) stale socket 을
// 다시 잡을 수 있다. → 재시도 전에 짧은 backoff 를 두어 OS 가 dead socket teardown + 새 TCP/TLS
// handshake 를 시작할 여유를 준다. 또 /mpa/home 은 mount 시 여러 카드가 GET 을 병렬로 쏘므로
// (profile·summary·graduation), 재시도가 같은 순간에 몰려 재충돌하지 않도록 jitter 를 더한다.
// 마지막 시도까지 실패하면 진짜 망 문제로 보고 그대로 propagate.

// 멱등 메서드만 재시도 — 비멱등(POST/PATCH/PUT/DELETE)은 첫 요청이 서버에 반영된 뒤 응답 경로에서
// TypeError 가 났을 수 있어 재요청 시 중복 쓰기 위험. (멱등 GET 은 secure=Authorization 을 실어도
// 서버 부작용이 없어 안전.) idempotency key 가 있는 portal-link 도 안전을 위해 멱등 메서드만 재시도.
const IDEMPOTENT_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);
// 재시도 전 대기(ms). 인덱스 = 직전 재시도 회차, 배열 길이 = 최대 재시도 횟수. ~250ms 는 dead socket
// teardown 여유의 하한 — 120ms 면 OS 가 미처 evict 못 해 또 stale socket 을 잡을 위험이 있다.
const RETRY_BACKOFFS_MS = [250, 600];

const sleep = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
// base 의 0~30% 를 비율 jitter 로 더해 병렬로 mount 된 카드들의 재시도 시점을 흩뜨린다(재충돌 방지).
// 비암호용 난수로 충분 — 타이밍 분산 목적뿐, 보안/결정성 요건 없음.
const backoffWithJitter = (base: number) => base + Math.floor(Math.random() * base * 0.3);

async function fetchWithStaleConnRetry(
  input: RequestInfo | URL,
  init?: RequestInit,
  // 401 재발급 경로(customFetch)가 이 함수를 두 번 호출한다. 재발급 후 재요청은 maxRetries=0 으로
  // 불러 재시도 budget 이 곱(최대 6회)으로 늘어 pool 압박이 커지는 것을 막는다 — 최악 3+1=4회로 제한.
  maxRetries: number = RETRY_BACKOFFS_MS.length
): Promise<Response> {
  const method = (init?.method ?? (input instanceof Request ? input.method : 'GET')).toUpperCase();
  const maxAttempts = IDEMPOTENT_METHODS.has(method) ? Math.min(maxRetries, RETRY_BACKOFFS_MS.length) : 0;

  let lastErr: unknown;
  for (let attempt = 0; attempt <= maxAttempts; attempt++) {
    try {
      return await fetch(input, init);
    } catch (err: unknown) {
      lastErr = err;
      // TypeError 만 전송 계층 실패(Load failed)로 보고 재시도. AbortError(DOMException)는 여기 걸리지
      // 않으므로 사용자/네비게이션 취소는 재요청하지 않는다. 명시적 offline 이면 재시도해도 의미 없고
      // backoff 만 낭비되므로 곧바로 propagate (navigator.onLine 은 WKWebView 에서 부정확할 수 있어
      // === false 인 확정 offline 일 때만 단축).
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      if (!(err instanceof TypeError) || attempt >= maxAttempts || offline) {
        throw err;
      }
      await sleep(backoffWithJitter(RETRY_BACKOFFS_MS[attempt]));
    }
  }
  // 도달 불가 — 루프는 매 회 return 하거나 throw 한다. 타입 안전용 fallback.
  throw lastErr;
}

export const createApiConfig = (): ApiConfig => ({
  baseUrl: BASE_URL,
  securityWorker: async () => {
    const accessToken = getAccessTokenStore();
    return accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : {};
  },
  baseApiParams: {
    credentials: 'include',
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  },
  customFetch: async (input, init) => {
    try {
      let response = await fetchWithStaleConnRetry(input, init);

      if (response.status === 401) {
        const headers = new Headers(init?.headers);
        if (headers.has('Authorization')) {
          const newAccessToken = await refreshAccessTokenStore();
          if (newAccessToken) {
            headers.set('Authorization', `Bearer ${newAccessToken}`);
            // 재발급 후 재요청은 추가 재시도 없이(0) — 위 호출에서 이미 fresh connection 을 만들었을
            // 가능성이 높고, 재시도 budget 이 곱으로 늘어 pool 압박이 커지는 것을 막는다.
            response = await fetchWithStaleConnRetry(input, { ...init, headers }, 0);
          }
        }
      }

      return response;
    } catch (err: any) {
      Sentry.withScope(scope => {
        scope.setLevel('fatal');
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        scope.setTag('route', url);
        Sentry.captureException(err);
      });
      throw err;
    }
  },
});
