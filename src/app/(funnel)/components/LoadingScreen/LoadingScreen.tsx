'use client';

import { useEffect, useRef, useState } from 'react';
import { captureException } from '@sentry/nextjs';
import { isInWebView } from '@/lib/webview';
import styles from './LoadingScreen.module.scss';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stateIndex, setStateIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  // 웹뷰에선 OS 가 실제 홈 인디케이터를 그리므로 아래 장식용 가짜 인디케이터는 숨긴다.
  // SSR/hydration 불일치(서버엔 window 없음)를 피하려 마운트 후에 판별한다.
  const [isWebView, setIsWebView] = useState(false);

  // 안내 문구 순환 — video 의 'ended' 이벤트가 아니라 독립 타이머로 구동한다.
  // (iOS WKWebView 는 사용자 제스처 없는 자동재생을 막을 수 있는데, 과거엔 문구 전환이 video.play()→'ended'
  //  에 종속돼 있어 재생이 거부되면 로고와 함께 문구까지 첫 상태로 얼어붙었다. 텍스트를 비디오와 분리한다.)
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

  // 로고 비디오 자동재생. 마크업의 autoPlay/loop 로 1차 시도하되, 일부 웹뷰는 명시적 play() 가 필요해
  // 한 번 더 호출한다. iOS 자동재생 정책으로 거부(NotAllowedError)되면 Sentry 로만 추적하고 조용히 넘긴다
  // — 문구 순환은 위 타이머가 독립적으로 유지하므로 화면이 멈춰 보이지 않는다.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }
    // React 는 SSR/hydration 시 <video> 의 muted 를 DOM 에 반영하지 않는 경우가 있어 hydration 후
    // video.muted 가 false 로 남는다. iOS(WKWebView)는 unmuted 동영상의 제스처 없는 자동재생을 막으므로
    // play() 가 NotAllowedError 로 거부된다. play() 직전에 muted 를 프로퍼티+속성 양쪽으로 강제한다.
    video.muted = true;
    video.setAttribute('muted', '');
    void video.play().catch(captureException);
  }, []);

  useEffect(() => {
    setIsWebView(isInWebView());
  }, []);

  const currentState = LOADING_STATES[stateIndex];

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <video ref={videoRef} className={styles.video} playsInline muted loop autoPlay preload="auto">
            <source src="/videos/chuck_loading.mp4" type="video/mp4" />
          </video>
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
