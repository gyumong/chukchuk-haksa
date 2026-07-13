import type { SelectHTMLAttributes } from 'react';
import styles from './Field.module.scss';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange' | 'value'> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  /** 빈 값(미선택)을 허용할 때 첫 항목으로 넣을 라벨. */
  placeholder?: string;
}

// 레포에 재사용 가능한 Select 프리미티브가 없어 native <select> 로 만든다.
// 어드민(dev 도구) 안에서만 쓰므로 전역 ui/ 로 승격하지 않는다 — 디자인 시스템에 편입하려면
// 별도 논의가 필요하다.
export function Select({ label, value, onChange, options, placeholder, id, ...props }: SelectProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <select
        id={id}
        className={styles.select}
        value={value}
        onChange={event => onChange(event.target.value)}
        {...props}
      >
        {placeholder !== undefined && <option value="">{placeholder}</option>}
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
