'use client';

import { useEffect } from 'react';
import { notifyRendered } from './bridge';

/**
 * 웹뷰 초기 로딩 시 빈 화면 노출을 줄이기 위한 컴포넌트.
 *
 * 네이티브가 onPageFinished(HTML 파싱 완료)에 로더를 내리면 CSR 렌더 전이라 빈 화면이 보인다.
 * 대신 웹이 첫 페인트 직후 'rendered' 브릿지를 송출하고, 네이티브가 그 신호에 로더/스플래시를 내리도록 한다.
 *
 * requestAnimationFrame 을 2회 중첩해 (커밋 → 다음 프레임 직전 → 그 다음 프레임) 실제 페인트가 끝난 뒤
 * 송출되도록 한다. 웹뷰가 아니면 postBridgeMessage 가 no-op 이라 일반 웹에는 영향이 없다.
 * 루트에 두어 웹뷰로 로드되는 모든 라우트(MPA·funnel)의 초기 로드 시 1회 송출된다.
 */
const NotifyRenderedToNative = () => {
  useEffect(() => {
    let innerRaf = 0;
    const outerRaf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(() => {
        notifyRendered();
      });
    });

    return () => {
      cancelAnimationFrame(outerRaf);
      cancelAnimationFrame(innerRaf);
    };
  }, []);

  return null;
};

export default NotifyRenderedToNative;
