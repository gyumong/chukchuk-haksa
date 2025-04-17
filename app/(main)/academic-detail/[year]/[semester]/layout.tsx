export const fetchCache = 'auto'

import NavBar from './components/NavBar';
import styles from './layout.module.scss';

export default function GraduationProgressLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className={styles.container}>
      <NavBar />
      <div className={styles.content}>{children}</div>
    </div>
  );
}
