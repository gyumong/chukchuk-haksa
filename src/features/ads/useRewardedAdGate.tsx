'use client';

import { useCallback, useRef, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { AD_UNITS } from './adUnits';

// 광고 시청 결과.
// - granted     : 광고를 끝까지 봐서 보상 획득 → 연동 진행
// - dismissed   : 광고가 떠 있었으나 사용자가 거부/중단 → 보상 미획득 → 연동 진행하지 않음
// - unavailable : 광고 자체가 없음(미설정/미충전/GPT 미로드) → 막을 수 없으니 그대로 진행
export type RewardedResult = 'granted' | 'dismissed' | 'unavailable';

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
      timer = setTimeout(() => settle('unavailable'), READY_TIMEOUT_MS);

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
          settle('unavailable');
          return;
        }

        const definedSlot = slot;
        const pubads = googletag.pubads();
        definedSlot.addService(pubads);

        const onReady = (event: RewardedEvent) => {
          if (event.slot !== definedSlot) {
            return;
          }
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
    title: '광고 시청 후 업데이트',
    message: '짧은 광고를 끝까지 본 뒤\n최신 학업 정보로 업데이트돼요.',
    confirmText: '광고 보고 업데이트',
    cancelText: '취소',
    onConfirm: acceptOptIn,
    onClose: declineOptIn,
  };

  return { showRewardedAd, optInDialog };
}
