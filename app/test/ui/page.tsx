'use client';

import { useRef, useState } from 'react';
import SchoolCard from '@/components/SchoolCard/SchoolCard';
import { Button, FixedButton, TextField } from '@/components/ui';
import styles from './page.module.scss';
import { useRouter } from 'next/navigation';

export default function UITEST() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const router = useRouter();
  const handleLogin = async () => {
    try {
      const res = await fetch('/api/suwon-scrape/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '로그인 실패');
      }
      // 성공
      router.push('/suwon-scrape');
      console.log(data);
    } catch (err: any) {
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <SchoolCard schoolName="수원대학교" />
        <TextField
          placeholder="학번을 입력해주세요"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <TextField
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <FixedButton onClick={handleLogin}>학교 연동하기</FixedButton>
    </div>
  ); 
}
