import { getApiBaseUrl } from '@/config/environment';
import type { RefreshTokenApiResponse } from '@/shared/api/data-contracts';

export const REFRESH_TIMEOUT_MS = 10_000;

export interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 백엔드 /api/auth/refresh 호출. 성공 시 새 토큰 쌍 반환, 실패·타임아웃·형식 오류 시 null.
 *
 * `POST /api/session/refresh` 라우트와 `GET /api/session` 핸들러(만료 토큰 자동 갱신) 모두에서
 * 공유. 부작용 없음 — 세션 mutation 은 호출 측에서 수행한다.
 */
export async function refreshTokensFromBackend(refreshToken: string): Promise<RefreshedTokens | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REFRESH_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as RefreshTokenApiResponse;
    if (!payload.success || !payload.data?.accessToken || !payload.data?.refreshToken) {
      return null;
    }

    return {
      accessToken: payload.data.accessToken,
      refreshToken: payload.data.refreshToken,
    };
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[refreshTokensFromBackend] timed out after', REFRESH_TIMEOUT_MS, 'ms');
    } else {
      console.error('[refreshTokensFromBackend] unexpected error', error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
