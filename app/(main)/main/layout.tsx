'use client';

import type { PropsWithChildren } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  const router = useInternalRouter();
  const handleRightIconClick = () => {
    router.push('/setting');
  };

  return (
    <div className={styles.container}>
      <TopNavigation.Preset
        title="수원대학교"
        type="none"
        rightIcon="setting"
        onRightIconClick={handleRightIconClick}
      />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
