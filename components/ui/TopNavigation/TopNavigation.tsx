import type { ReactNode } from 'react';
import type { IconType } from '@/components/ui/Icon';
import { Icon } from '@/components/ui/Icon';
import styles from './TopNavigation.module.scss';

// Base Types
interface TopNavigationRootProps {
  children: ReactNode;
  className?: string;
}

interface TopNavigationLeftProps {
  children?: ReactNode;
}

interface TopNavigationTitleProps {
  children: ReactNode;
}

interface TopNavigationRightProps {
  children?: ReactNode;
}

// Compound Components
function TopNavigationRoot({ children, className }: TopNavigationRootProps) {
  return <div className={`${styles.container} ${className || ''}`}>{children}</div>;
}

function Left({ children }: TopNavigationLeftProps) {
  return children ? <div className={styles.leftArea}>{children}</div> : null;
}

function Title({ children }: TopNavigationTitleProps) {
  return <div className={styles.titleArea}>{children}</div>;
}

function Right({ children }: TopNavigationRightProps) {
  return children ? <div className={styles.rightArea}>{children}</div> : null;
}

// Preset Types
type NavigationType = 'back' | 'close' | 'none';

interface PresetTopNavigationProps {
  title: string;
  type?: NavigationType;
  onNavigationClick?: () => void;
  rightIcon?: IconType;
  onRightIconClick?: () => void;
  className?: string;
}

// Preset Component
export function PresetTopNavigation({
  title,
  type = 'none',
  onNavigationClick,
  rightIcon,
  onRightIconClick,
  className,
}: PresetTopNavigationProps) {
  return (
    <TopNavigationRoot className={className}>
      <Left>
        {type !== 'none' && (
          <button onClick={onNavigationClick} className={styles.iconButton}>
            <Icon name={type === 'back' ? 'arrow-left' : 'close'} size={24} />
          </button>
        )}
      </Left>
      <Title>
        <span className={styles.title}>{title}</span>
      </Title>
      <Right>
        {rightIcon && (
          <button onClick={onRightIconClick} className={styles.iconButton}>
            <Icon name={rightIcon} size={24} />
          </button>
        )}
      </Right>
    </TopNavigationRoot>
  );
}

// Export Compound Components
export const TopNavigation = {
  Root: TopNavigationRoot,
  Left,
  Title,
  Right,
  Preset: PresetTopNavigation,
};
