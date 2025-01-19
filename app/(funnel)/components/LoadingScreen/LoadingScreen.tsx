'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoadingScreen.module.scss';

const LOADING_STATES = [
  {
    title: '학교 정보를 불러오는 중이에요',
    description: '척척학사에서 수집하는 개인 정보는\n학교 연동 후 즉시 폐기됩니다.'
  },
  {
    title: '불러온 정보를 입력하고 있어요',
    description: '척척학사에서 수집하는 개인 정보는\n학교 연동 후 즉시 폐기됩니다.'
  },
  {
    title: '학교 인증이 거의 다 되었어요!',
    description: '척척학사에서 수집하는 개인 정보는\n학교 연동 후 즉시 폐기됩니다.'
  }
];

interface LoadingScreenProps {
  targetPath: string;
  minRepeatCount?: number;
  onComplete: (currentRepeatCount: number) => void;
}

const LoadingScreen = ({ targetPath, minRepeatCount = 0, onComplete }: LoadingScreenProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playCount, setPlayCount] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {return;}

    const handleEnded = () => {
      setFadeState('out');
      
      setTimeout(() => {
        const nextCount = playCount + 1;
        setPlayCount(nextCount);
        setFadeState('in');
        
        // 최소 반복 횟수 이상 실행됐을 때 onComplete 호출
        onComplete(nextCount);
        
        // 비디오 계속 재생
        video.play();
      }, 300);
    };

    video.addEventListener('ended', handleEnded);
    video.play();

    return () => {
      video.removeEventListener('ended', handleEnded);
    };
  }, [playCount, onComplete]);

  const currentState = LOADING_STATES[playCount % LOADING_STATES.length];

  return (
    <div className={styles.wrapper}>


      <main className={styles.main}>
        <div className={styles.videoContainer}>
          <video
            ref={videoRef}
            className={styles.video}
            playsInline
            muted
          >
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