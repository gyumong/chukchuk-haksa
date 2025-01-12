import type { ReactNode } from 'react';
import { Button } from './Button';
import type { ButtonProps } from './Button';
import styles from './Button.module.scss';

interface FixedButtonProps extends Omit<ButtonProps, 'width' | 'size'> {
  children: ReactNode;
}

export function FixedButton({ children, variant = 'primary', className = '', ...props }: FixedButtonProps) {
  return (
    <Button variant={variant} width="full" size="md" className={`${styles.fixed} ${className}`} {...props}>
      {children}
    </Button>
  );
}
