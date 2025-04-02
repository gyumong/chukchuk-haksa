'use client';

import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './layout.module.scss';

export default function ResyncLoginLayout({ children }: { children: React.ReactNode }) {
  const router = useInternalRouter();

  return (
    <div className={styles.container}>
      <TopNavigation.Preset title="" type="back" onNavigationClick={() => router.back()} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
