'use client';

import { useCallback, useRef, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { AD_UNITS } from './adUnits';

// 광고 시청 결과.
// - granted     : 광고를 끝까지 봐서 보상 획득 → 연동 진행
// - dismissed   : 광고가 떠 있었으나 사용자가 거부/중단 → 보상 미획득 → 연동 진행하지 않음
// - exhausted   : 이 페이지에서 광고를 이미 한 번 소진(GPT 는 페이지당 rewarded 1개) → 새 슬롯이 null.
//                 우회(취소→재클릭→통과) 방지 위해 진행하지 않고, 새로고침 안내로 재장전 유도.
// - unavailable : 광고 자체가 없음(미설정/미충전/GPT 미로드, 아직 한 번도 안 뜸) → 막을 수 없으니 진행
export type RewardedResult = 'granted' | 'dismissed' | 'unavailable' | 'exhausted';

// 광고가 '준비(rewardedSlotReady)'될 때까지 대기 한도. 초과 시(충전 실패 등) unavailable 로 보고 진행.
const READY_TIMEOUT_MS = 5000;

// --- 최소 GPT(Google Publisher Tag) 타입 (사용하는 표면만) ---
interface RewardedSlot {
  addService: (service: PubAdsService) => RewardedSlot;
}
interface RewardedEvent {
  slot: RewardedSlot;
  makeRewardedVisible: () => void;
  payload?: { reward: number; type: string };
}
type RewardedListener = (event: RewardedEvent) => void;
interface PubAdsService {
  addEventListener: (type: string, listener: RewardedListener) => void;
  removeEventListener: (type: string, listener: RewardedListener) => void;
}
interface Googletag {
  cmd: { push: (fn: () => void) => void };
  pubads: () => PubAdsService;
  enableServices: () => void;
  display: (slot: RewardedSlot) => void;
  destroySlots: (slots: RewardedSlot[]) => void;
  defineOutOfPageSlot: (adUnitPath: string, format: number) => RewardedSlot | null;
  enums: { OutOfPageFormat: { REWARDED: number } };
}
type GoogletagWindow = Window & { googletag?: Googletag };

// GPT 스크립트(gpt.js)가 아직 로드 전이면 명령 큐(stub)만 보장한다.
// gpt.js 가 끝내 로드되지 않으면 cmd 콜백이 안 돌므로, 호출부의 READY_TIMEOUT 가 unavailable 로 회수.
const getGoogletag = (): Googletag | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const w = window as GoogletagWindow;
  w.googletag = w.googletag ?? ({ cmd: [] } as unknown as Googletag);
  return w.googletag.cmd ? w.googletag : null;
};

// GPT 제약: 페이지 1회 로드당 rewarded 광고 1개만 가능. 한 번 광고가 떴다 닫히면(취소 포함) 같은
// 페이지에선 두 번째 defineOutOfPageSlot 가 null 로 떨어진다 → 새로고침 전까지 재시청 불가.
// "이미 소진(exhausted)" 을 "광고 인프라 없음(unavailable)" 과 구분해, 취소→재클릭 우회를 막는다.
// 모듈 스코프 = 페이지 로드 단위 수명(SPA 클라 네비게이션으론 리셋 안 됨 — GPT 제약과 일치).
let adOfferedThisPageView = false;

/**
 * 홈 갱신하기 → 보상형 광고 게이트 훅 (브라우저 전용).
 * - showRewardedAd(): 광고를 요청하고, 준비되면 opt-in 다이얼로그를 띄운 뒤 결과를 Promise 로 반환.
 * - optInDialog: 동의 UI props (ConfirmDialog 에 그대로 spread).
 * 앱(웹뷰)에선 호출하지 않는다 — 앱은 네이티브 AdMob 책임.
 */
export function useRewardedAdGate() {
  const [isOpen, setIsOpen] = useState(false);
  // accept/decline 핸들러가 진행 중 광고의 상태에 접근하기 위한 브릿지.
  const settleRef = useRef<((result: RewardedResult) => void) | null>(null);
  const makeVisibleRef = useRef<(() => void) | null>(null);

  const showRewardedAd = useCallback((): Promise<RewardedResult> => {
    return new Promise<RewardedResult>(resolve => {
      // 이미 이 페이지에서 rewarded 를 한 번 띄웠으면 GPT 제약상 새 광고 불가(페이지당 1개).
      // 슬롯 생성·5초 READY_TIMEOUT 을 거치지 않고 즉시 exhausted 로 반환(재클릭 지연 제거).
      if (adOfferedThisPageView) {
        resolve('exhausted');
        return;
      }
      const adUnitPath = AD_UNITS.RESYNC_REWARDED;
      const googletag = getGoogletag();
      if (!adUnitPath || !googletag) {
        resolve('unavailable');
        return;
      }

      let settled = false;
      let slot: RewardedSlot | null = null;
      let granted = false;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let teardown: (() => void) | null = null;

      const settle = (result: RewardedResult) => {
        if (settled) {
          return;
        }
        settled = true;
        if (timer) {
          clearTimeout(timer);
        }
        teardown?.();
        teardown = null;
        if (slot) {
          try {
            googletag.destroySlots([slot]);
          } catch (error) {
            captureException(error);
          }
          slot = null;
        }
        makeVisibleRef.current = null;
        settleRef.current = null;
        setIsOpen(false);
        resolve(result);
      };
      settleRef.current = settle;

      // 준비될 때까지의 대기만 가드. 광고가 떠서 시청이 시작되면(onReady) 해제한다.
      // 한 번이라도 광고가 떴던 페이지면 'exhausted'(진행X), 아니면 'unavailable'(진행O).
      timer = setTimeout(() => settle(adOfferedThisPageView ? 'exhausted' : 'unavailable'), READY_TIMEOUT_MS);

      googletag.cmd.push(() => {
        if (settled) {
          return;
        }
        try {
          slot = googletag.defineOutOfPageSlot(adUnitPath, googletag.enums.OutOfPageFormat.REWARDED);
        } catch (error) {
          captureException(error);
          settle('unavailable');
          return;
        }
        if (!slot) {
          // 2번째 클릭 등 — 이미 이 페이지에서 rewarded 소진됨 → null. 우회 방지 위해 exhausted.
          settle(adOfferedThisPageView ? 'exhausted' : 'unavailable');
          return;
        }

        const definedSlot = slot;
        const pubads = googletag.pubads();
        definedSlot.addService(pubads);

        const onReady = (event: RewardedEvent) => {
          if (event.slot !== definedSlot) {
            return;
          }
          // 광고가 실제로 떴음 — 이후 같은 페이지의 재요청은 exhausted 로 처리(우회 차단).
          adOfferedThisPageView = true;
          if (timer) {
            clearTimeout(timer);
            timer = undefined;
          }
          // 동의(accept) 후에만 노출 — opt-in 필수(정책).
          makeVisibleRef.current = () => {
            try {
              event.makeRewardedVisible();
            } catch (error) {
              captureException(error);
              settle('unavailable');
            }
          };
          setIsOpen(true);
        };
        const onGranted = (event: RewardedEvent) => {
          if (event.slot === definedSlot) {
            granted = true;
          }
        };
        const onClosed = (event: RewardedEvent) => {
          if (event.slot === definedSlot) {
            settle(granted ? 'granted' : 'dismissed');
          }
        };

        teardown = () => {
          pubads.removeEventListener('rewardedSlotReady', onReady);
          pubads.removeEventListener('rewardedSlotGranted', onGranted);
          pubads.removeEventListener('rewardedSlotClosed', onClosed);
        };
        pubads.addEventListener('rewardedSlotReady', onReady);
        pubads.addEventListener('rewardedSlotGranted', onGranted);
        pubads.addEventListener('rewardedSlotClosed', onClosed);

        googletag.enableServices();
        googletag.display(definedSlot);
      });
    });
  }, []);

  // 동의: 광고 노출. 결과(granted/dismissed)는 GPT 이벤트로 settle.
  const acceptOptIn = useCallback(() => {
    setIsOpen(false);
    makeVisibleRef.current?.();
  }, []);

  // 거부(취소/오버레이/ESC): 보상 미획득 → dismissed.
  const declineOptIn = useCallback(() => {
    settleRef.current?.('dismissed');
  }, []);

  const optInDialog = {
    isOpen,
    title: '안내',
    message: '척척학사를 위한 짧은 광고가 재생된 후,\n최신 학업 정보 업데이트 화면으로 이동합니다.',
    confirmText: '확인',
    cancelText: '취소',
    onConfirm: acceptOptIn,
    onClose: declineOptIn,
  };

  return { showRewardedAd, optInDialog };
}
