import type { InputHTMLAttributes } from 'react';
import styles from './Field.module.scss';

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  label: string;
  /** 빈 문자열 = 미입력(요청 바디에서 생략). 숫자로 강제 변환하지 않는다. */
  value: string;
  onChange: (value: string) => void;
}

// ui/TextField 는 clear 아이콘·cva variant 를 갖춘 폼 전용 컴포넌트라 숫자 입력 격자에 얹으면
// 세로로 길어진다. 어드민의 조밀한 격자에는 라벨 + native input 이면 충분하다.
export function NumberField({ label, value, onChange, id, ...props }: NumberFieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="number"
        className={styles.input}
        value={value}
        onChange={event => onChange(event.target.value)}
        {...props}
      />
    </div>
  );
}
