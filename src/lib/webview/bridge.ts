type WebViewWindow = {
  ReactNativeWebView?: { postMessage?: (message: string) => void };
  webkit?: { messageHandlers?: { bridge?: { postMessage?: (message: string) => void } } };
  Android?: { postMessage?: (message: string) => void };
};

const getWebViewWindow = (): WebViewWindow | null => {
  if (typeof window === 'undefined') return null;
  return window as unknown as WebViewWindow;
};

export const isInWebView = (): boolean => {
  const w = getWebViewWindow();
  if (!w) return false;
  return Boolean(w.ReactNativeWebView || w.webkit?.messageHandlers?.bridge || w.Android);
};

export const postBridgeMessage = (message: string): void => {
  const w = getWebViewWindow();
  if (!w) return;

  if (w.ReactNativeWebView?.postMessage) {
    w.ReactNativeWebView.postMessage(message);
    return;
  }
  if (w.webkit?.messageHandlers?.bridge?.postMessage) {
    w.webkit.messageHandlers.bridge.postMessage(message);
    return;
  }
  if (w.Android?.postMessage) {
    w.Android.postMessage(message);
    return;
  }

  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.warn('[bridge] no native bridge detected; message dropped:', message);
  }
};

export const navigateNative = (url: string): void => {
  postBridgeMessage(`navigate:${url}`);
};
