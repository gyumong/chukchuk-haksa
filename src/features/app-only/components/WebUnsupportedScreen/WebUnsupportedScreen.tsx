'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/constants/app-store';
import styles from './WebUnsupportedScreen.module.scss';

type Platform = 'ios' | 'android' | 'other';

const detectPlatform = (): Platform => {
  const ua = navigator.userAgent;
  // iPadOS 13+ 는 데스크톱 Safari UA 로 위장하므로 터치 지원 여부로 보정한다.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1)) {
    return 'ios';
  }
  if (/Android/i.test(ua)) {
    return 'android';
  }
  return 'other';
};

const openStore = (url: string) => {
  // URL 미설정 시 빈 href 로 현재 페이지가 새로고침되는 것을 막는다.
  if (!url) {
    return;
  }
  window.location.href = url;
};

// 웹 서비스 종료 안내. 모바일은 OS 에 맞는 스토어 버튼 하나, 그 외(PC 등)는 두 스토어 버튼을 모두 보여준다.
// UA 는 SSR 에서 알 수 없어 첫 렌더는 'other'(두 버튼)로 그리고 마운트 후 좁힌다.
const WebUnsupportedScreen = () => {
  const [platform, setPlatform] = useState<Platform>('other');

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  return (
    <main className={styles.container}>
      <Image src="/images/illustrations/CommonError.png" alt="" width={160} height={160} priority />
      <h1 className={styles.title}>{'이제 척척학사는\n앱에서만 이용하실 수 있습니다'}</h1>
      <p className={styles.message}>
        {'척척학사 웹 서비스는 더 이상 제공되지 않습니다.\n앱을 설치하시면 학업 관리를 계속 이용하실 수 있습니다.'}
      </p>

      <div className={styles.buttons}>
        {platform === 'ios' && (
          <Button width="full" onClick={() => openStore(APP_STORE_URL)}>
            앱 설치하기
          </Button>
        )}
        {platform === 'android' && (
          <Button width="full" onClick={() => openStore(PLAY_STORE_URL)}>
            앱 설치하기
          </Button>
        )}
        {platform === 'other' && (
          <>
            <Button width="full" onClick={() => openStore(APP_STORE_URL)}>
              App Store에서 받기
            </Button>
            <Button variant="secondary" width="full" onClick={() => openStore(PLAY_STORE_URL)}>
              Google Play에서 받기
            </Button>
          </>
        )}
      </div>
    </main>
  );
};

export default WebUnsupportedScreen;
