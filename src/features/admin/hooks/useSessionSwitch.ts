'use client';

import { useCallback, useState } from 'react';
import { showToast } from '@/components/ui/Toast';

interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * 테스트 계정의 ac/re 토큰을 브라우저 세션(cchaksa_session 쿠키)으로 교환한다.
 * e2e 의 loginAs 와 동일한 경로(POST /api/session)라 신규 인프라가 없다.
 *
 * 교환 후 페이지를 새로고침하는 이유: AuthProvider 는 마운트 시 한 번만 세션을 hydrate 하고
 * accessToken 을 인메모리 tokenStore 에 넣는다. 새로고침해야 새 계정의 토큰이 tokenStore 에
 * 실리고, React Query 캐시에 남아 있던 이전 계정 데이터도 함께 날아간다(계정 혼선 방지).
 */
export function useSessionSwitch() {
  const [isSwitching, setIsSwitching] = useState(false);

  const switchSession = useCallback(async ({ accessToken, refreshToken }: SessionTokens) => {
    setIsSwitching(true);
    try {
      const exchange = await fetch('/api/session', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken, refreshToken }),
      });

      if (!exchange.ok) {
        const detail = await exchange.text().catch(() => '');
        throw new Error(`세션 교환 실패 (${exchange.status}) ${detail.slice(0, 120)}`.trim());
      }

      // POST 200 만으로 성공을 단정하지 않는다 — 토큰이 무효여도 빈 세션과 함께 200
      // { ok:true, isPortalLinked:false } 가 내려올 수 있다(docs/e2e-backend-request.md §1).
      // 후속 GET 이 accessToken 을 돌려주는지까지 확인해야 진짜 세션이 만들어진 것이다.
      const verify = await fetch('/api/session', { credentials: 'include' });
      const session = verify.ok ? ((await verify.json()) as { accessToken?: string }) : null;
      if (!session?.accessToken) {
        throw new Error('세션이 만들어지지 않았습니다. 토큰이 만료되었거나 백엔드가 계정을 인증하지 못했습니다.');
      }

      showToast('계정 전환 완료 — 새로고침합니다');
      window.location.reload();
    } catch (error) {
      showToast(error instanceof Error ? `계정 전환 실패: ${error.message}` : '계정 전환 실패');
      setIsSwitching(false);
    }
  }, []);

  return { switchSession, isSwitching };
}
