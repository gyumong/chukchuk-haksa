'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { captureException } from '@sentry/nextjs';
import { isInWebView } from '@/lib/webview';
import styles from './LoadingScreen.module.scss';

// lottie-react 는 브라우저 전용(window 참조)이라 SSR 을 끄고 클라에서만 로드한다.
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// 로딩 애니메이션(Lottie). ~1MB 라 JS 번들에 넣지 않고 public 정적 자산으로 런타임 fetch 한다(CDN 캐시).
const LOADING_ANIMATION_PATH = '/videos/chuck_loading2.json';

const LOADING_STATES = [
  {
    title: '학교 정보를 불러오는 중이에요',
    description: '척척학사에서 수집하는 개인 정보는\n학교 연동 후 즉시 폐기됩니다.',
  },
  {
    title: '불러온 정보를 입력하고 있어요',
    description: '척척학사에서 수집하는 개인 정보는\n학교 연동 후 즉시 폐기됩니다.',
  },
  {
    title: '학교 인증이 거의 다 되었어요!',
    description: '척척학사에서 수집하는 개인 정보는\n학교 연동 후 즉시 폐기됩니다.',
  },
];

// 안내 문구 순환 간격 / 페이드 전환 시간.
const TEXT_ROTATE_INTERVAL_MS = 2500;
const FADE_DURATION_MS = 300;

const LoadingScreen = () => {
  const [stateIndex, setStateIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  // 웹뷰에선 OS 가 실제 홈 인디케이터를 그리므로 아래 장식용 가짜 인디케이터는 숨긴다.
  // SSR/hydration 불일치(서버엔 window 없음)를 피하려 마운트 후에 판별한다.
  const [isWebView, setIsWebView] = useState(false);
  const [animationData, setAnimationData] = useState<unknown>(null);

  // 안내 문구 순환 — 애니메이션과 무관하게 독립 타이머로 구동한다(문구가 멈춰 보이지 않도록).
  useEffect(() => {
    let fadeTimer: ReturnType<typeof setTimeout>;
    const interval = setInterval(() => {
      setFadeState('out');
      fadeTimer = setTimeout(() => {
        setStateIndex(prev => (prev + 1) % LOADING_STATES.length);
        setFadeState('in');
      }, FADE_DURATION_MS);
    }, TEXT_ROTATE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
    };
  }, []);

  // 로딩 애니메이션 로드. Lottie(SVG/JS 구동)는 video 와 달리 iOS 자동재생 정책의 영향을 받지 않아
  // 과거의 video.muted/play() 우회가 필요 없다. fetch 실패는 Sentry 로만 남기고 조용히 넘긴다
  // (문구 순환은 위 타이머가 유지하므로 화면이 멈춰 보이지 않는다).
  useEffect(() => {
    let cancelled = false;
    fetch(LOADING_ANIMATION_PATH)
      .then(res => res.json())
      .then(data => {
        if (!cancelled) {
          setAnimationData(data);
        }
      })
      .catch(captureException);

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    setIsWebView(isInWebView());
  }, []);

  const currentState = LOADING_STATES[stateIndex];

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.animationContainer}>
          {!!animationData && (
            <Lottie animationData={animationData} loop autoplay className={styles.animation} />
          )}
        </div>

        <div className={`${styles.textContainer} ${styles[fadeState]}`}>
          <h1>{currentState.title}</h1>
          <p>{currentState.description}</p>
        </div>
      </main>

      <div className={styles.bottomBar}>{!isWebView && <div className={styles.indicator} />}</div>
    </div>
  );
};

export default LoadingScreen;
