// 동일한 에러 객체가 여러 AsyncBoundary에서 동시에 화면에 중복 노출되는 것을 막는다.
// React Query는 동일 queryKey를 구독하는 여러 컴포넌트에 대해, 재요청 전까지는
// 동일한 에러 객체 참조를 공유한다. 그래서 객체 참조 자체를 dedupe 키로 쓸 수 있다.
// 재요청/새로고침 시엔 새 에러 객체가 생기므로, 별도 해제 로직 없이도 자연스럽게
// 다시 표시된다.
const claimedErrors = new WeakSet<object>();

export function claimError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    // 원시값 에러는 참조 공유가 불가능하니 항상 표시
    return true;
  }
  if (claimedErrors.has(error)) {
    return false;
  }
  claimedErrors.add(error);
  return true;
}