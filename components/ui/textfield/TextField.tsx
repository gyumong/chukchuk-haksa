import React, { ChangeEvent, FocusEvent, forwardRef, InputHTMLAttributes, useCallback, useMemo, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Icon } from '../Icon';
import styles from './TextField.module.scss';

const textFieldVariants = cva(styles.base, {
  variants: {
    state: {
      default: styles['state-default'],
      error: styles['state-error'],
      typing: styles['state-typing'],
    },
    focus: {
      before: styles['focus-before'],
      after: styles['focus-after'],
    },
  },
  defaultVariants: {
    state: 'default',
    focus: 'before',
  },
});

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof textFieldVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  showDeleteIcon?: boolean;
  onClear?: () => void; // 추가
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      state,
      focus,
      className,
      onFocus,
      onBlur,
      onChange,
      onClear,
      value: propValue = '',
      showDeleteIcon = true,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);

    // Focus events
    const handleFocus = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
      },
      [onFocus]
    );

    const handleBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
      },
      [onBlur]
    );

    // Change event
    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
      },
      [onChange]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        onChange?.({
          target: { value: '' },
        } as ChangeEvent<HTMLInputElement>);
        onClear?.();
      },
      [onChange, onClear]
    );
    // state, focus 결정 로직
    const inputState = useMemo(() => {
      if (state) return state;
      return isFocused ? 'typing' : 'default';
    }, [state, isFocused]);

    const focusState = useMemo(() => {
      if (isFocused) return 'before';
      return propValue ? 'after' : 'before';
    }, [isFocused, propValue]);

    const showClearButton = useMemo(() => {
      return showDeleteIcon && typeof propValue === 'string' && propValue.length > 0;
    }, [showDeleteIcon, propValue]);

    return (
      <div className={styles.container}>
        {label && (
          <label htmlFor={props.id} className={styles.label}>
            {label}
          </label>
        )}

        <div className={styles.inputWrapper}>
          <input
            ref={ref}
            className={textFieldVariants({
              state: inputState,
              focus: focusState,
              className,
            })}
            value={propValue}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={state === 'error'}
            aria-describedby={`${props.id}-helper ${props.id}-error`}
            {...props}
          />

          {showClearButton && (
            <button type="button" className={styles.deleteIcon} onClick={handleClear} aria-label="입력 내용 삭제">
              <Icon name="delete" size={24} />
            </button>
          )}
        </div>

        {errorMessage && inputState === 'error' && (
          <p id={`${props.id}-error`} className={styles.errorMessage}>
            {errorMessage}
          </p>
        )}

        {helperText && !errorMessage && (
          <p id={`${props.id}-helper`} className={styles.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

TextField.displayName = 'TextField';
