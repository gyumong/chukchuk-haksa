'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FixedButton, TextField } from '@/components/ui';
import { FunnelHeadline, SchoolCard } from '../components';
import styles from './page.module.scss';

export default function PortalLogin() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/suwon-scrape/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '로그인 실패');
      }
      router.push('/suwon-scrape');
    } catch (err: any) {
      // 에러 처리
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <FunnelHeadline
        title="재학 중인 학교<br/>계정을 연동해주세요"
        description="척척학사에서 수집하는 개인 정보는<br/>학교 연동 후 즉시 폐기됩니다."
      />

      <div className={styles.formContainer}>
        <SchoolCard schoolName="수원대학교" />

        <TextField placeholder="학번을 입력해주세요" value={username} onChange={e => setUsername(e.target.value)} />

        <TextField
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <FixedButton onClick={handleLogin} disabled={!username || !password} isLoading={isLoading}>
        학교 연동하기
      </FixedButton>
    </div>
  );
}
