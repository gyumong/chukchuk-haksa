import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Button } from './Button';
import styles from './Button.module.scss';

interface FixedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary';
}

export function FixedButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: FixedButtonProps) {
  return (
    <Button
      variant={variant}
      width="full"
      size="md"
      className={`${styles.fixed} ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
}