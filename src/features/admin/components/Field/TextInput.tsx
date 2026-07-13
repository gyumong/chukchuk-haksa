import type { InputHTMLAttributes } from 'react';
import styles from './Field.module.scss';

interface TextInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function TextInput({ label, value, onChange, id, ...props }: TextInputProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="text"
        className={styles.input}
        value={value}
        onChange={event => onChange(event.target.value)}
        {...props}
      />
    </div>
  );
}
