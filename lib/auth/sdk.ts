export function initializeKakao() {
  if (!window.Kakao) {
    throw new Error('Kakao SDK is not loaded.');
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.NEXT_PUBLIC_JAVASCRIPT_KEY!);
  }
}

export function cleanupKakao() {
  if (window.Kakao?.isInitialized()) {
    window.Kakao.cleanup();
  }
}

export function isKakaoReady() {
  return !!window.Kakao && window.Kakao.isInitialized();
}
