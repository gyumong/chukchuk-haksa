import { captureException } from '@sentry/nextjs';

type BridgePostMessage = (message: string) => void;

type WebViewWindow = {
  ReactNativeWebView?: { postMessage?: BridgePostMessage };
  webkit?: { messageHandlers?: { bridge?: { postMessage?: BridgePostMessage } } };
  Android?: { postMessage?: BridgePostMessage };
};

const getWebViewWindow = (): WebViewWindow | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window as unknown as WebViewWindow;
};

const resolveBridgePostMessage = (w: WebViewWindow): BridgePostMessage | null => {
  if (typeof w.ReactNativeWebView?.postMessage === 'function') {
    return w.ReactNativeWebView.postMessage.bind(w.ReactNativeWebView);
  }
  if (typeof w.webkit?.messageHandlers?.bridge?.postMessage === 'function') {
    return w.webkit.messageHandlers.bridge.postMessage.bind(w.webkit.messageHandlers.bridge);
  }
  if (typeof w.Android?.postMessage === 'function') {
    return w.Android.postMessage.bind(w.Android);
  }
  return null;
};

export const isInWebView = (): boolean => {
  const w = getWebViewWindow();
  if (!w) {
    return false;
  }
  return resolveBridgePostMessage(w) !== null;
};

export const postBridgeMessage = (message: string): boolean => {
  const w = getWebViewWindow();
  if (!w) {
    return false;
  }

  const post = resolveBridgePostMessage(w);
  if (!post) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[bridge] no native bridge detected; message dropped:', message);
    }
    return false;
  }

  try {
    post(message);
    return true;
  } catch (err) {
    captureException(err, { extra: { bridgeMessage: message } });
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[bridge] postMessage threw; swallowed to protect UI:', message, err);
    }
    return false;
  }
};

export const navigateNative = (url: string): boolean => {
  return postBridgeMessage(`navigate:${url}`);
};

// 웹 화면의 < 뒤로가기 버튼 탭을 네이티브에 위임한다. colon 없는 단일 토큰이라
// 기존 navigate:<path> 파서와 충돌하지 않는다. 프로토콜: docs/mpa-school-link-handoff.md M3.
export const navigateBack = (): boolean => {
  return postBridgeMessage('navigateBack');
};

// 웹에서 홈으로 리다이렉트하는 지점을, 웹뷰에선 네이티브 앱 홈 화면으로의 이동으로 위임한다.
// (웹은 router.push(home), 웹뷰는 이 이벤트만 송출하고 자체 라우팅은 하지 않음.)
// 학교 인증 '완료' 신호인 done:portal-link 와는 별개 — 이쪽은 단순 홈 이동 의도다.
export const redirectToHome = (): boolean => {
  return postBridgeMessage('redirectToHome');
};

// /mpa/delete 확인 페이지의 '탈퇴하기' 버튼 → 네이티브에 계정 탈퇴 처리를 위임한다.
// (/mpa/me '탈퇴하기' 는 이 확인 페이지로 이동하고, 페이지 버튼이 이 이벤트를 송출한다.)
export const withdraw = (): boolean => {
  return postBridgeMessage('withdraw');
};

// 웹뷰 초기 로딩 시 첫 페인트 직후 네이티브에 렌더 완료를 통지한다. 네이티브는 onPageFinished
// (HTML 파싱 완료)가 아니라 이 신호에 로더/스플래시를 내려야, CSR 렌더 전까지의 빈 화면 노출이 줄어든다.
// 송출 시점은 requestAnimationFrame 으로 실제 페인트 이후가 되도록 호출부에서 보장한다.
export const notifyRendered = (): boolean => {
  return postBridgeMessage('rendered');
};
