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
}

const AuthContext = createContext<AuthContextValue | null>(null);

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
      try {
        const response = await fetch('/api/session', { credentials: 'include' });
        if (cancelled) {return;}

        if (!response.ok) {
          setAccessTokenStore(null);
          setIsPortalLinked(null);
          return;
        }

        const data = (await response.json()) as {
          accessToken?: string;
          isPortalLinked?: boolean;
        };
        if (cancelled) {return;}

        setAccessTokenStore(data.accessToken ?? null);
        setIsPortalLinked(typeof data.isPortalLinked === 'boolean' ? data.isPortalLinked : null);
      } catch (error) {
        if (!cancelled) {
          console.error('[AuthContext] hydrate failed', error);
        }
      } finally {
        if (!cancelled) {setIsReady(true);}
      }
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

  return (
    <AuthContext.Provider value={{ accessToken, isPortalLinked, isReady, clearAuth, refresh }}>
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
