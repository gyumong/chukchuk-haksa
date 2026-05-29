import { getApiBaseUrl } from '@/config/environment';

export const ANALYTICS_ID_TIMEOUT_MS = 5_000;

// 백엔드 응답 모양 인라인 정의 — yarn api:update 가 PR #202(기타 area type + portal-link 평탄화)
// 와 같은 batch 에서 회수되므로 data-contracts 회귀를 본 PR 에 끌어들이지 않기 위한 가드.
// PR #202 머지 후 dev 기반 rebase 시점에 api:update 가 자동 회수하면 import 로 전환 가능.
interface AnalyticsIdApiResponse {
  success: boolean;
  data: {
    analyticsId: string;
  };
}

/**
 * 백엔드 `GET /api/users/analytics-id` 호출. 성공 시 analyticsId(사용자 PK UUID) 반환,
 * 실패·타임아웃·형식 오류 시 null.
 *
 * `/auth/callback` (로그인 직후) 와 `GET /api/session` (세션에 미저장 시 lazy fetch),
 * `POST /api/session` (MPA 익스체인지 시 첫 식별자 채움) 에서 공유. 부작용 없음 —
 * 세션 mutation 은 호출 측에서 수행한다.
 *
 * null 반환은 wire-up 자동 skip — 사용자 가시 에러 없이 익명 추적으로 graceful degrade.
 */
export async function fetchAnalyticsIdFromBackend(accessToken: string): Promise<string | null> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ANALYTICS_ID_TIMEOUT_MS);

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/users/analytics-id`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as AnalyticsIdApiResponse;
    if (!payload.success || !payload.data?.analyticsId) {
      return null;
    }

    return payload.data.analyticsId;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.error('[fetchAnalyticsIdFromBackend] timed out after', ANALYTICS_ID_TIMEOUT_MS, 'ms');
    } else {
      console.error('[fetchAnalyticsIdFromBackend] unexpected error', error);
    }
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}
