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

export const postBridgeMessage = (message: string): void => {
  const w = getWebViewWindow();
  if (!w) {
    return;
  }

  const post = resolveBridgePostMessage(w);
  if (!post) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[bridge] no native bridge detected; message dropped:', message);
    }
    return;
  }

  try {
    post(message);
  } catch (err) {
    captureException(err, { extra: { bridgeMessage: message } });
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('[bridge] postMessage threw; swallowed to protect UI:', message, err);
    }
  }
};

export const navigateNative = (url: string): void => {
  postBridgeMessage(`navigate:${url}`);
};
