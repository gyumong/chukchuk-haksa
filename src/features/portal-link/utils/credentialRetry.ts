// 자격증명 실패 후 로그인 폼으로 복귀할 때 학번/에러코드를 넘기는 핸드오프.
// sessionStorage 기반(탭 한정). 비밀번호는 절대 저장하지 않는다.
// 프라이버시 모드/용량 초과 시 sessionStorage 가 DOMException 을 던질 수 있어 모든 접근을 try-catch 로 감싼다.

const USERNAME_KEY = 'portal-link:last-username';
const CODE_KEY = 'portal-link:retry-code';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/** 로그인 폼 제출 직전 호출. 실패 시 학번을 prefill 하기 위함. */
export function stashAttemptUsername(username: string): void {
  if (!isBrowser()) {
    return;
  }
  try {
    sessionStorage.setItem(USERNAME_KEY, username);
  } catch {
    // 무시. 최악의 경우 재시도 시 학번이 prefill 되지 않는 정도.
  }
}

/** 스크래핑이 자격증명 실패를 감지했을 때 호출. 로그인 폼에서 메시지로 변환. */
export function stashRetryCode(code: string): void {
  if (!isBrowser()) {
    return;
  }
  try {
    sessionStorage.setItem(CODE_KEY, code);
  } catch {
    // 무시. 최악의 경우 에러 메시지가 표시되지 않는 정도.
  }
}

/** 로그인 폼 mount 시 1회 호출. 값을 읽고 두 키를 모두 비운다. */
export function popRetry(): { username: string; code: string } {
  if (!isBrowser()) {
    return { username: '', code: '' };
  }
  try {
    const username = sessionStorage.getItem(USERNAME_KEY) ?? '';
    const code = sessionStorage.getItem(CODE_KEY) ?? '';
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(CODE_KEY);
    return { username, code };
  } catch {
    return { username: '', code: '' };
  }
}

/** 연동 성공 시 잔여 핸드오프 값을 정리. */
export function clearRetry(): void {
  if (!isBrowser()) {
    return;
  }
  try {
    sessionStorage.removeItem(USERNAME_KEY);
    sessionStorage.removeItem(CODE_KEY);
  } catch {
    // 정리는 best-effort. 실패해도 무시.
  }
}
