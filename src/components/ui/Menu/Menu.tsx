import styles from './Menu.module.scss';
import MenuItem from './MenuItem/MenuItem';
import type { MenuProps } from './types';

const Menu = ({ items }: MenuProps) => {
  return (
    <div className={styles.menu}>
      {items.map((item, index) => (
        <MenuItem key={`${item.label}-${index}`} {...item} />
      ))}
    </div>
  );
};

export default Menu;
