export type ErrorCategory = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
export type ErrorTrigger = 'query' | 'mutation';
export type ErrorSeverity = 'toast' | 'modal' | 'screen' | 'global';
export type ErrorAction = 'retry' | 'inquiry' | 'both';

export interface ErrorTreatment {
  severity: ErrorSeverity;
  /** screen/modal에서 어떤 버튼을 보여줄지. toast/global에는 의미 없음. */
  action?: ErrorAction;
  /** true면 발생 시 Sentry로 관측 필요 (빈도 추적 대상). */
  sentry?: boolean;
}

interface ErrorCodeConfig {
  category: ErrorCategory;
  query?: ErrorTreatment;
  mutation?: ErrorTreatment;
}

const GLOBAL: ErrorTreatment = { severity: 'global' };

/**
 * 에러 코드별 처리 방식(alert / 모달 / 에러 화면)을 코드로 표현한 것.
 *
 * - 조회(query) 실패는 항상 화면류(screen)로 그 영역을 대체한다. 카드처럼 작게 보일지
 *   화면 전체를 덮을지는 AsyncBoundary의 fullPage prop(=페이지 구조)에 달려 있다.
 * - mutation 실패는 콘텐츠가 이미 떠 있으므로 토스트(A) 또는 모달(B/D/F)로 처리한다.
 * - 인증/세션(C)은 발생 위치와 무관하게 항상 전역 처리.
 * - action은 "사용자 조건 문제라 재시도 무의미(B/E → 문의하기만)" vs "일시적 오류라
 *   재시도할 가치 있음(D/F → 재시도+문의하기 둘 다)"을 구분한다.
 *
 * 참고: T13, U03은 현재 백엔드에 이 코드를 실제로 던지는 경로가 없다(2026-09 확인).
 */
const ERROR_CODE_CONFIG: Record<string, ErrorCodeConfig> = {
  // A. 사용자 입력/자격증명 문제 — mutation에서만 발생
  P01: { category: 'A', mutation: { severity: 'toast' } },
  P03: { category: 'A', mutation: { severity: 'toast' } },
  S02: { category: 'A', mutation: { severity: 'toast' } },
  C01: { category: 'A', mutation: { severity: 'toast' } },
  C09: { category: 'A', mutation: { severity: 'toast' } },

  // B. 학적/데이터 구조적 제약 — 재시도 무의미, 문의하기만
  T13: { category: 'B', query: { severity: 'screen', action: 'inquiry' }, mutation: { severity: 'modal', action: 'inquiry' } },
  G02: { category: 'B', query: { severity: 'screen', action: 'inquiry' }, mutation: { severity: 'modal', action: 'inquiry' } },
  A03: { category: 'B', query: { severity: 'screen', action: 'inquiry' }, mutation: { severity: 'modal', action: 'inquiry' } },
  U03: { category: 'B', query: { severity: 'screen', action: 'inquiry' }, mutation: { severity: 'modal', action: 'inquiry' } },
  U04: { category: 'B', query: { severity: 'screen', action: 'inquiry' }, mutation: { severity: 'modal', action: 'inquiry' } },
  A07: { category: 'B', query: { severity: 'screen', action: 'inquiry' }, mutation: { severity: 'modal', action: 'inquiry' } },
  A08: { category: 'B', query: { severity: 'screen', action: 'inquiry' }, mutation: { severity: 'modal', action: 'inquiry' } },

  // C. 인증/세션 — 항상 전역
  A04: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  A05: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T01: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T02: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T03: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T04: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T05: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T06: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T07: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T08: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T09: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T10: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T11: { category: 'C', query: GLOBAL, mutation: GLOBAL },
  T12: { category: 'C', query: GLOBAL, mutation: GLOBAL },

  // D. 일시적 시스템/인프라 오류 — 재시도+문의 둘 다, 전부 Sentry 관측 대상
  C02: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C03: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  P02: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C10: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C11: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C12: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C16: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C18: { category: 'D', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },

  // E. 데이터 없음 — 재시도 무의미, 문의하기만 (query에서만 발생)
  U01: { category: 'E', query: { severity: 'screen', action: 'inquiry' } },
  U02: { category: 'E', query: { severity: 'screen', action: 'inquiry' } },
  S01: { category: 'E', query: { severity: 'screen', action: 'inquiry' } },
  A01: { category: 'E', query: { severity: 'screen', action: 'inquiry' } },
  A02: { category: 'E', query: { severity: 'screen', action: 'inquiry' } },
  C06: { category: 'E', query: { severity: 'screen', action: 'inquiry' } },
  A06: { category: 'E', query: { severity: 'screen', action: 'inquiry' } },

  // F. 개발자 실수/시스템 무결성 오류 — D와 동일하게 재시도+문의, 전부 Sentry 관측 대상
  C07: { category: 'F', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C08: { category: 'F', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C15: { category: 'F', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C17: { category: 'F', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  C19: { category: 'F', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
  S03: { category: 'F', query: { severity: 'screen', action: 'both', sentry: true }, mutation: { severity: 'modal', action: 'both', sentry: true } },
};

export function getErrorTreatment(appCode: string | undefined, trigger: ErrorTrigger): ErrorTreatment | undefined {
  if (!appCode) {
    return undefined;
  }
  return ERROR_CODE_CONFIG[appCode]?.[trigger];
}

export function getErrorCategory(appCode: string | undefined): ErrorCategory | undefined {
  if (!appCode) {
    return undefined;
  }
  return ERROR_CODE_CONFIG[appCode]?.category;
}