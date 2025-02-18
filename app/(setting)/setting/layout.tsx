import type { PropsWithChildren } from 'react';
import { useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  return (
    <div className={styles.container}>
      <TopNavigation.Preset title="설정" type="back" onNavigationClick={() => router.back()} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
