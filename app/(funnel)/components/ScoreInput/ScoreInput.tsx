import type { ChangeEvent} from 'react';
import { useEffect, useRef, useState } from 'react';
import styles from './ScoreInput.module.scss';

interface Props {
    value: string;
    onChange: (value: string) => void;
}

export default function ScoreInput({ value = '3.5', onChange }: Props) {
  const [scoreWidthPx, setScoreWidthPx] = useState<number>(0);
  const hiddenSpanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!hiddenSpanRef.current) {return;}
    measureTextWidth('3.5');
  }, []);

  const measureTextWidth = (text: string) => {
    if (!hiddenSpanRef.current) {return;}
    hiddenSpanRef.current.textContent = text;
    const measured = hiddenSpanRef.current.offsetWidth;
    const minWidthPx = 48;
    setScoreWidthPx(Math.max(measured, minWidthPx));
  };

  const handleScoreChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d.]/g, ''); // 숫자와 점만 허용

    // 첫 번째 숫자가 4보다 크면 4로 제한
    if (value.length === 1 && parseInt(value) > 4) {
      value = '4';
    }

    // 소수점이 없는 경우 자동으로 추가
    if (value.length === 2 && !value.includes('.')) {
      value = value[0] + '.' + value[1];
    }

    // 소수점 이후 두 자리까지만 허용
    const parts = value.split('.');
    if (parts[1] && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }

    // 4.5 초과 방지
    if (parseFloat(value) > 4.5) {
      value = '4.5';
    }

    onChange(value);
    measureTextWidth(value || '0');
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        inputMode="decimal"
        className={styles.score}
        value={value}
        onChange={handleScoreChange}
        style={{ width: scoreWidthPx ? `${scoreWidthPx}px` : '48px' }}
      />
      <span className={styles.divider}>I</span>
      <span className={styles.maxScore}>4.5</span>
      <span ref={hiddenSpanRef} className={styles.hiddenSpan} aria-hidden="true">
        {value}
      </span>
    </div>
  );
}
