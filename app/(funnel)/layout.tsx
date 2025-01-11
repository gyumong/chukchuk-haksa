import { PropsWithChildren } from 'react';
import styles from './layout.module.scss';

export default function FunnelLayout({ children }: PropsWithChildren) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
