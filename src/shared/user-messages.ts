const BY_STATUS: Record<number, string> = {
  401: '아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.',
  404: '요청한 데이터를 찾을 수 없습니다.\n학과/입학년도 정보를 확인해주세요.',
  409: '이미 포털 연동된 학생 정보가 존재합니다.\n다른 계정으로 로그인했는지 확인해주세요.',
  422: '입력하신 학적 정보로는 현재 처리가 불가능합니다.\n세부 사유를 확인해주세요.',
  423: '계정이 잠겼습니다. 포털사이트에서 비밀번호 재설정을 진행해주세요.',
  500: '알 수 없는 오류가 발생했어요.\n잠시 후 다시 시도해주세요.',
};

const BY_APP_CODE: Record<string, string> = {
  S04: '이미 포털 연동된 학생 정보가 존재합니다.\n다른 계정으로 로그인했는지 확인해주세요.',
  D01: '복수전공 이수 구분 정보가 존재하지 않아 처리할 수 없습니다.\n학사정보를 확인해주세요.',
  T13: '편입생 학적 정보는 현재 지원되지 않습니다.\n추후 지원 예정입니다.',
  G02: '사용자에게 맞는 졸업 요건 데이터가 존재하지 않습니다.\n학과/입학년도 정보를 확인해주세요.',
};

export function getUserMessage(status?: number, appCode?: string, fallback?: string) {
  const s = status ?? 500;
  return (appCode && BY_APP_CODE[appCode]) || BY_STATUS[s] || fallback || BY_STATUS[500];
}
