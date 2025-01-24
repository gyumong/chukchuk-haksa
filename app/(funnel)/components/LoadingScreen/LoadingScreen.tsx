'use client';

import { useEffect, useRef, useState } from 'react';
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

const LoadingScreen = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playCount, setPlayCount] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const handleEnded = () => {
      setFadeState('out');

      setTimeout(() => {
        const nextCount = playCount + 1;
        setPlayCount(nextCount);
        setFadeState('in');

        video.play();
      }, 300);
    };

    video.addEventListener('ended', handleEnded);
    video.play();

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [playCount]);

  const currentState = LOADING_STATES[playCount % LOADING_STATES.length];

  return (
    <div className={styles.wrapper}>
      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <video ref={videoRef} className={styles.video} playsInline muted>
            <source src="/videos/chuck_loading.mp4" type="video/mp4" />
          </video>
        </div>

        <div className={`${styles.textContainer} ${styles[fadeState]}`}>
          <h1>{currentState.title}</h1>
          <p>{currentState.description}</p>
        </div>
      </main>

      <div className={styles.bottomBar}>
        <div className={styles.indicator} />
      </div>
    </div>
  );
};

export default LoadingScreen;
