'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
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
