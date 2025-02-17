import type { PropsWithChildren } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <TopNavigation.Preset title="탈퇴하기" type="back" />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
