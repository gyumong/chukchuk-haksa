// components/ui/Menu/MenuItem/MenuItem.tsx
import type { MenuItemProps } from '../types';
import styles from './MenuItem.module.scss';

export default function MenuItem({ label, onClick, color, icon }: MenuItemProps) {
  return (
    <div className={styles.container} onClick={onClick} style={{ color }}>
      <span className={styles.label}>{label}</span>
      {icon && <div className={styles.icon}>{icon}</div>}
    </div>
  );
}
