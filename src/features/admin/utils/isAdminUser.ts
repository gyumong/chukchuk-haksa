// 지금은 학번 화이트리스트로 판별. 추후 백엔드에 role/isAdmin 필드가 생기면
// 이 함수 내부만 교체하면 되고, 호출부(설정 화면 등)는 그대로 둔다.
const ADMIN_STUDENT_CODES = new Set(
  (process.env.NEXT_PUBLIC_ADMIN_STUDENT_CODES ?? '')
    .split(',')
    .map(code => code.trim())
    .filter(Boolean)
);

export function isAdminUser(studentCode?: string): boolean {
  if (!studentCode) {
    return false;
  }
  return ADMIN_STUDENT_CODES.has(studentCode);
}