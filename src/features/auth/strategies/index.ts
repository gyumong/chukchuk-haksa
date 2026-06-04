import { hasNativeAuthCapability, isInWebView } from '@/lib/webview';
import { browserStrategy } from './browserStrategy';
import { getDevMockStrategy } from './devMockStrategy';
import { webviewStrategy } from './webviewStrategy';
import type { AuthStrategy } from './types';

// 컨텍스트에 맞는 인증 전략을 선택한다.
// 웹뷰이고 네이티브가 토큰 주입 + refresh 응답 브릿지를 제공할 때만 webviewStrategy.
// 둘 중 하나라도 없으면(구버전 앱/브라우저) browserStrategy 로 자동 fallback → 안전·가역.
export function selectStrategy(): AuthStrategy {
  // 개발 전용: ?mockAccessToken=<token> 이 있으면 accessToken 만으로 테스트(쿠키·카카오·네이티브 불필요).
  // 프로덕션 번들에선 NODE_ENV 정적 분기로 제거(dead-code elimination)된다.
  if (process.env.NODE_ENV !== 'production') {
    const mock = getDevMockStrategy();
    if (mock) {
      return mock;
    }
  }
  if (isInWebView() && hasNativeAuthCapability()) {
    return webviewStrategy;
  }
  return browserStrategy;
}

export type { AuthStrategy, SessionState } from './types';
