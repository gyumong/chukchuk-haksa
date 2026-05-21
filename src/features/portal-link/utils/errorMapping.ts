import { ENV } from '@/config/environment';
import type { JobStatusResponse } from '@/shared/api/data-contracts';

const ERROR_MESSAGES_BY_CODE: Record<string, string> = {
  S04: '이미 포털 연동된 학생 정보가 존재합니다.\n다른 계정으로 로그인했는지 확인해주세요.',
  D01: '복수전공 이수 구분 정보가 존재하지 않아 처리할 수 없습니다.\n학사정보를 확인해주세요.',
  T13: '편입생 학적 정보는 현재 지원되지 않습니다.\n추후 지원 예정입니다.',
  G02: '사용자에게 맞는 졸업 요건 데이터가 존재하지 않습니다.\n학과/입학년도 정보를 확인해주세요.',
  // 자격증명 실패(아이디/비번 불일치) 코드. 백엔드 명칭이 확정되지 않아 두 변형 모두 매핑.
  PORTAL_AUTH_FAILED: '아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.',
  PORTAL_LOGIN_FAILED: '아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.',
  PORTAL_ACCOUNT_LOCKED: '계정이 잠겼습니다. 포털사이트로 돌아가서 학번/사번 찾기 및 비밀번호 재발급을 진행해주세요',
};

const DEFAULT_ERROR_MESSAGE = '알 수 없는 오류가 발생했어요\n잠시후 다시 시도해주세요';

const portalLinkTimeoutMinutes = Math.max(1, Math.round(ENV.PORTAL_LINK_TIMEOUT_MS / 60000));
export const TIMEOUT_ERROR_MESSAGE = `연동 응답이 ${portalLinkTimeoutMinutes}분 이상 없어 자동으로 실패 처리되었어요.\n잠시 후 다시 시도해주세요.`;

export function getMessageByErrorCode(code?: string): string {
  return (code && ERROR_MESSAGES_BY_CODE[code]) || DEFAULT_ERROR_MESSAGE;
}

export function getPortalLinkErrorMessage(job: JobStatusResponse): string {
  return getMessageByErrorCode(job.error_code);
}

export type PortalLinkFailureKind = 'credential' | 'ineligible' | 'system';

// 사용자가 직접 고칠 수 있는 자격증명 오류 (재로그인으로 해결)
const CREDENTIAL_CODES = new Set(['PORTAL_AUTH_FAILED', 'PORTAL_LOGIN_FAILED', 'PORTAL_ACCOUNT_LOCKED']);
// 입력은 맞지만 학적/데이터상 진행이 불가한 케이스
const INELIGIBLE_CODES = new Set(['S04', 'D01', 'T13', 'G02']);

export interface PortalLinkFailure {
  kind: PortalLinkFailureKind;
  code: string;
  message: string;
  shouldCapture: boolean;
}

export function classifyPortalLinkFailure(job: JobStatusResponse): PortalLinkFailure {
  const code = job.error_code ?? '';

  if (CREDENTIAL_CODES.has(code)) {
    return { kind: 'credential', code, message: getMessageByErrorCode(code), shouldCapture: false };
  }
  if (INELIGIBLE_CODES.has(code)) {
    return { kind: 'ineligible', code, message: getMessageByErrorCode(code), shouldCapture: false };
  }
  // 미상 코드는 관측이 필요한 시스템 이상으로 분류. 매핑된 메시지가 있으면 활용, 없으면 기본 메시지.
  return { kind: 'system', code, message: getMessageByErrorCode(code), shouldCapture: true };
}
