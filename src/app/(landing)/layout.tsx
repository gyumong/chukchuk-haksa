import KakaoProvider from '@/components/KakaoProvider';
import { WEB_UNSUPPORTED } from '@/constants/app-store';
import { WebUnsupportedScreen } from '@/features/app-only/components';
import styles from './layout.module.scss';

export const fetchCache = 'default-cache';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  // 웹 서비스 종료: 로그인 전 랜딩에서도 카카오 SDK 로드 없이 앱 설치 안내만 보여준다.
  if (WEB_UNSUPPORTED) {
    return <WebUnsupportedScreen />;
  }

  return (
    <KakaoProvider>
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </KakaoProvider>
  );
}
