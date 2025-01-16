'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SchoolCard } from '@/app/(funnel)/components';
import { FixedButton, TextField } from '@/components/ui';
import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './page.module.scss';
import LoadingScreen from '@/app/(funnel)/components/LoadingScreen/LoadingScreen';

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
    } catch (err: any) {}
  };

    return <LoadingScreen targetPath="/complete" minRepeatCount={3} onComplete={()=>console.log('complete')}/>;
}
