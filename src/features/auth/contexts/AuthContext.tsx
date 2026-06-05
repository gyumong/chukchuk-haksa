'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { queryClient } from '@/shared/api/configs/queryClient';
import { resetAnalytics, setAnalyticsUser } from '@/lib/analytics';
import {
  getAccessTokenStore,
  refreshAccessTokenStore,
  setAccessTokenStore,
  setRefreshTransport,
  subscribeAccessTokenStore,
} from '../tokenStore';
import { selectStrategy } from '../strategies';
import type { SessionState } from '../strategies';

interface AuthContextValue {
  accessToken: string | null;
  isPortalLinked: boolean | null;
  /** Amplitude 등 분석 도구 식별자 (사용자 PK UUID). 미응답 시 null. */
  analyticsId: string | null;
  isReady: boolean;
  clearAuth: () => Promise<void>;
  refresh: () => Promise<string | null>;
  // 외부에서 명시적으로 /api/session 재호출이 필요할 때 (e.g. 학교 연동 완료 직후 isPortalLinked
  // 를 false → true 로 승격해야 하는 시점). 마운트 시 자동 hydrate 와 동일한 로직.
  hydrate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessTokenStore());
  const [isPortalLinked, setIsPortalLinked] = useState<boolean | null>(null);
  const [analyticsId, setAnalyticsIdState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  // 컨텍스트(브라우저/웹뷰)에 맞는 인증 전략을 1회 선택해 고정한다 (재선택 시 transport churn 방지).
  const strategyRef = useRef<ReturnType<typeof selectStrategy> | null>(null);
  if (strategyRef.current === null) {
    strategyRef.current = selectStrategy();
  }
  const strategy = strategyRef.current;

  useEffect(() => {
    return subscribeAccessTokenStore(token => setAccessTokenState(token));
  }, []);

  // 인증된 적 있다가 token 이 null 로 떨어진 경우 (= 만료 → refresh 실패) React Query 캐시 wipe.
  // 보호 페이지가 unmount 되는 동안 stale 데이터를 다음 세션이 잘못 재사용하는 사고 방지.
  const previousTokenRef = useRef<string | null>(accessToken);
  useEffect(() => {
    if (previousTokenRef.current !== null && accessToken === null) {
      queryClient.clear();
    }
    previousTokenRef.current = accessToken;
  }, [accessToken]);

  // Amplitude identity wire-up: accessToken/isPortalLinked 와 동일 동기 블록에서 처리해 race
  // 방지 (보호 페이지가 API 호출 시작하기 전에 식별자 채움). MPA WebView 도 같은 hydration
  // 경로를 거치므로 별도 처리 불필요. analyticsId 가 null 인 경우 — 세션 만료 등 암묵적
  // 로그아웃 — SDK 의 user_id 도 클리어해 다음 익명 트래픽이 이전 사용자로 잘못 잡히지 않게 함
  // (device_id 는 유지; 전체 reset 은 명시적 clearAuth 가 담당).
  const applySessionState = useCallback((result: SessionState) => {
    setAccessTokenStore(result.accessToken);
    setIsPortalLinked(result.isPortalLinked);
    setAnalyticsUser(result.analyticsId);
    setAnalyticsIdState(result.analyticsId);
  }, []);

  useEffect(() => {
    // 전략별 refresh 전송 방식을 tokenStore 에 설치 — httpConfig 의 401 자동 refresh 가 이 경유.
    setRefreshTransport(strategy.refreshTransport);

    let cancelled = false;
    (async () => {
      const result = await strategy.hydrate();
      if (cancelled) {
        return;
      }
      if (result !== null) {
        applySessionState(result);
      }
      setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [applySessionState, strategy]);

  const clearAuth = useCallback(async () => {
    try {
      await strategy.clear();
    } catch (error) {
      // clear 가 실패해도 아래 로컬 정리는 항상 수행해 부분 로그아웃 상태를 막는다.
      console.error('[AuthContext] strategy.clear() failed', error);
    } finally {
      // 순서 critical: reset 이 토큰 store 초기화보다 먼저 — reset 이 새 device_id 를 발급하므로
      // 이후 익명 트래픽이 새 device 로 잡힘. 같은 브라우저에서 다른 계정으로 재로그인해도
      // 이전 유저 이벤트와 섞이지 않음.
      resetAnalytics();
      setAccessTokenStore(null);
      setIsPortalLinked(null);
      setAnalyticsIdState(null);
    }
  }, [strategy]);

  const refresh = useCallback(() => refreshAccessTokenStore(), []);

  const hydrate = useCallback(async () => {
    const result = await strategy.hydrate();
    if (result !== null) {
      applySessionState(result);
    }
  }, [applySessionState, strategy]);

  return (
    <AuthContext.Provider value={{ accessToken, isPortalLinked, analyticsId, isReady, clearAuth, refresh, hydrate }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
