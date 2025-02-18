import KakaoProvider from '@/components/KakaoProvider';
import styles from './layout.module.scss';

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <KakaoProvider>
      <div className={styles.container}>
        <div className={styles.content}>{children}</div>
      </div>
    </KakaoProvider>
  );
}
