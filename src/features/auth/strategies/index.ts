import { hasNativeAuthCapability, isInWebView } from '@/lib/webview';
import { browserStrategy } from './browserStrategy';
import { webviewStrategy } from './webviewStrategy';
import type { AuthStrategy } from './types';

// 컨텍스트에 맞는 인증 전략을 선택한다.
// 웹뷰이고 네이티브가 토큰 주입 + refresh 응답 브릿지를 제공할 때만 webviewStrategy.
// 둘 중 하나라도 없으면(구버전 앱/브라우저) browserStrategy 로 자동 fallback → 안전·가역.
export function selectStrategy(): AuthStrategy {
  if (isInWebView() && hasNativeAuthCapability()) {
    return webviewStrategy;
  }
  return browserStrategy;
}

export type { AuthStrategy, SessionState } from './types';
