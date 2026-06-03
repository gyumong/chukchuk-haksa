import { browserStrategy } from './browserStrategy';
import type { AuthStrategy } from './types';

// 컨텍스트(브라우저/웹뷰)에 맞는 인증 전략을 선택한다.
// Phase 1: 항상 browserStrategy. 웹뷰 전략은 후속 단계에서 capability 게이트 뒤에 추가한다.
export function selectStrategy(): AuthStrategy {
  return browserStrategy;
}

export type { AuthStrategy, SessionState } from './types';
