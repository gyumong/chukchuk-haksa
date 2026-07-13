import { useId } from 'react';
import styles from './Field.module.scss';

interface LabeledCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function LabeledCheckbox({ label, checked, onChange, disabled }: LabeledCheckboxProps) {
  const id = useId();

  return (
    <div className={styles.checkboxField}>
      <input
        id={id}
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        disabled={disabled}
        onChange={event => onChange(event.target.checked)}
      />
      <label htmlFor={id} className={styles.checkboxLabel}>
        {label}
      </label>
    </div>
  );
}
