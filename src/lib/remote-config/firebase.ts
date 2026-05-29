import { type FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { fetchAndActivate, getRemoteConfig, getValue, type RemoteConfig } from 'firebase/remote-config';
import { ENV, getEnvironment } from '@/config/environment';
import { REMOTE_CONFIG_DEFAULTS, type RemoteConfigKey } from '@/lib/remote-config/keys';

// Firebase SDK 직접 import 는 이 모듈에서만. 다른 코드는 wrapper 함수만 사용.
// 향후 다른 RemoteConfig 제공자로 교체할 때 한 곳만 수정하면 됨.

// Production 에서 1h, 임시 디버깅 시 console 에서 줄일 것. 너무 짧으면 Firebase quota 소모.
const MIN_FETCH_INTERVAL_MS = 60 * 60 * 1000;

let initialized = false;
let remoteConfigInstance: RemoteConfig | null = null;
let fetchPromise: Promise<boolean> | null = null;

function buildFirebaseConfig() {
  return {
    apiKey: ENV.FIREBASE_API_KEY,
    authDomain: ENV.FIREBASE_AUTH_DOMAIN,
    projectId: ENV.FIREBASE_PROJECT_ID,
    storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
    appId: ENV.FIREBASE_APP_ID,
  };
}

function ensureInit(): void {
  if (initialized) {
    return;
  }
  // SSR/edge 가드 — Firebase Web SDK 는 window 의존.
  if (typeof window === 'undefined') {
    return;
  }
  // prod 환경만 활성화 (운영 결정). dev/preview/local 에서는 모든 hook 이 default 반환.
  // 임시 디버깅 필요 시 이 가드를 일시적으로 풀고 dev key 로 init.
  if (getEnvironment() !== 'production') {
    initialized = true;
    return;
  }
  if (!ENV.FIREBASE_API_KEY) {
    // 키 누락 — silent skip + 한 번만 경고.
    // eslint-disable-next-line no-console
    console.warn('[remote-config] FIREBASE_API_KEY missing — disabled');
    initialized = true;
    return;
  }

  // HMR 등으로 모듈이 재평가될 때 initializeApp 이 중복 호출되면 throw — getApps()[0] 으로 우회.
  const app: FirebaseApp = getApps()[0] ?? initializeApp(buildFirebaseConfig());
  remoteConfigInstance = getRemoteConfig(app);
  remoteConfigInstance.defaultConfig = REMOTE_CONFIG_DEFAULTS;
  remoteConfigInstance.settings.minimumFetchIntervalMillis = MIN_FETCH_INTERVAL_MS;

  initialized = true;
}

/** 클라이언트 진입 직후 1회 호출. `RemoteConfigProvider` 가 mount 시 발동. */
export function initRemoteConfig(): void {
  ensureInit();
}

/**
 * Firebase Console 에서 최신 값 fetch + activate. dedupe 처리 — 동시에 여러 hook 이 호출해도
 * 단일 네트워크 요청. SDK 미초기화 환경(dev/preview/key 누락) 에서는 즉시 `false` 반환.
 */
export async function fetchAndActivateRemoteConfig(): Promise<boolean> {
  ensureInit();
  if (!remoteConfigInstance) {
    return false;
  }
  if (fetchPromise) {
    return fetchPromise;
  }
  fetchPromise = (async () => {
    try {
      return await fetchAndActivate(remoteConfigInstance!);
    } catch (error) {
      // 네트워크/quota 오류 — defaultValue 로 graceful degrade. 사용자 가시 에러 없음.
      console.error('[remote-config] fetchAndActivate failed', error);
      return false;
    } finally {
      fetchPromise = null;
    }
  })();
  return fetchPromise;
}

/**
 * 캐시된 RemoteConfig 값을 동기적으로 조회. defaultValue 의 타입에 따라 boolean/number/string 으로
 * 강제 변환. SDK 미초기화 환경 또는 미 fetch 상태에서는 defaultValue 반환.
 */
export function getRemoteConfigValue<T extends string | number | boolean>(
  key: RemoteConfigKey,
  defaultValue: T
): T {
  if (!remoteConfigInstance) {
    return defaultValue;
  }
  const value = getValue(remoteConfigInstance, key);
  // 'static' = SDK 가 기본 cache 외 어떤 소스도 본 적 없음. defaultConfig 의 값이 더 신뢰 가능.
  if (value.getSource() === 'static') {
    return defaultValue;
  }
  if (typeof defaultValue === 'boolean') {
    return value.asBoolean() as T;
  }
  if (typeof defaultValue === 'number') {
    return value.asNumber() as T;
  }
  return value.asString() as T;
}
