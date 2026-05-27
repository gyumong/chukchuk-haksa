'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { queryClient } from '@/shared/api/configs/queryClient';
import {
  getAccessTokenStore,
  refreshAccessTokenStore,
  setAccessTokenStore,
  subscribeAccessTokenStore,
} from '../tokenStore';

interface AuthContextValue {
  accessToken: string | null;
  isPortalLinked: boolean | null;
  isReady: boolean;
  clearAuth: () => Promise<void>;
  refresh: () => Promise<string | null>;
  // 외부에서 명시적으로 /api/session 재호출이 필요할 때 (e.g. 학교 연동 완료 직후 isPortalLinked
  // 를 false → true 로 승격해야 하는 시점). 마운트 시 자동 hydrate 와 동일한 로직.
  hydrate: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function fetchSessionState(): Promise<{ accessToken: string | null; isPortalLinked: boolean | null } | null> {
  try {
    const response = await fetch('/api/session', { credentials: 'include' });
    if (!response.ok) {
      return { accessToken: null, isPortalLinked: null };
    }
    const data = (await response.json()) as {
      accessToken?: string;
      isPortalLinked?: boolean;
    };
    return {
      accessToken: data.accessToken ?? null,
      isPortalLinked: typeof data.isPortalLinked === 'boolean' ? data.isPortalLinked : null,
    };
  } catch (error) {
    console.error('[AuthContext] session fetch failed', error);
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessTokenStore());
  const [isPortalLinked, setIsPortalLinked] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const result = await fetchSessionState();
      if (cancelled) {
        return;
      }
      if (result !== null) {
        setAccessTokenStore(result.accessToken);
        setIsPortalLinked(result.isPortalLinked);
      }
      setIsReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const clearAuth = useCallback(async () => {
    try {
      await fetch('/api/session', { method: 'DELETE', credentials: 'include' });
    } catch (error) {
      console.error('[AuthContext] clearAuth request failed', error);
    }
    setAccessTokenStore(null);
    setIsPortalLinked(null);
  }, []);

  const refresh = useCallback(() => refreshAccessTokenStore(), []);

  const hydrate = useCallback(async () => {
    const result = await fetchSessionState();
    if (result !== null) {
      setAccessTokenStore(result.accessToken);
      setIsPortalLinked(result.isPortalLinked);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ accessToken, isPortalLinked, isReady, clearAuth, refresh, hydrate }}>
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
