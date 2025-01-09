'use client';

import { useRef, useState } from 'react';
import SchoolCard from '@/components/SchoolCard/SchoolCard';
import { Button, TextField } from '@/components/ui';
import styles from './page.module.scss';

export default function UITEST() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState<string>('');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SchoolCard schoolName="수원대학교" />
        <TextField
          type="password"
          ref={inputRef}
          placeholder="학번을 입력해주세요"
          value={value}
          onChange={handleChange}
        />
        <TextField placeholder="학번을 입력해주세요" state={'error'} type="password" />
      </div>
      <Button width="full" disabled>
        버튼
      </Button>
    </div>
  );
}
