import { ENV } from '@/config/environment';

// GAM 광고 단위 코드 — 대시보드 Ad unit 의 'Code' 와 정확히 일치해야 한다.
const REWARDED_RESYNC_CODE = 'cchaksa_resync_rewarded';

// 광고 단위 경로 `/<networkCode>/<code>`.
// 네트워크 코드(NEXT_PUBLIC_GAM_NETWORK_CODE) 미설정 시 null → 광고 비활성(showRewardedAd 가 'unavailable').
export const AD_UNITS = {
  RESYNC_REWARDED: ENV.GAM_NETWORK_CODE ? `/${ENV.GAM_NETWORK_CODE}/${REWARDED_RESYNC_CODE}` : null,
} as const;
