// Firebase RemoteConfig 의 flag 키 레지스트리. 실제 플래그가 도입될 때 여기에 등록한다.
//
// 사용 패턴:
//   1. REMOTE_CONFIG_KEYS 에 `MY_FLAG: 'my_flag'` 추가
//   2. REMOTE_CONFIG_DEFAULTS 에 default 값 추가 (Firebase Console 미응답 시 fallback)
//   3. 호출부: `const enabled = useRemoteConfig(REMOTE_CONFIG_KEYS.MY_FLAG, REMOTE_CONFIG_DEFAULTS.MY_FLAG)`
//
// Firebase Console 의 Parameter 이름과 정확히 일치시킬 것.
export const REMOTE_CONFIG_KEYS = {
  // TBD — 실제 flag 가 추가되면 등록.
} as const;

// Firebase Console 에 도달하기 전(첫 fetch 전, network 실패, prod 외 환경)에 사용되는 fallback.
// 명시적으로 정의해 두면 무중단 변경 + 안전한 dev 동작 보장.
export const REMOTE_CONFIG_DEFAULTS: Record<string, string | number | boolean> = {
  // TBD — REMOTE_CONFIG_KEYS 와 짝지어 추가.
};

// 추후 키가 채워지면 다음으로 좁힐 것:
// export type RemoteConfigKey = (typeof REMOTE_CONFIG_KEYS)[keyof typeof REMOTE_CONFIG_KEYS];
export type RemoteConfigKey = string;
