'use client';

import { useActionState, useState } from 'react';
import { captureException, setUser } from '@sentry/nextjs';
import { FixedButton, TextField } from '@/components/ui';
import styles from './PortalLoginForm.module.scss';

interface PortalLoginFormProps {
  onSuccess: () => void;
}

export function PortalLoginForm({ onSuccess }: PortalLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [error, submitAction, isPending] = useActionState(async (_: any, formData: FormData) => {
    try {
      const res = await fetch('/api/suwon-scrape/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.get('username'),
          password: formData.get('password'),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || '로그인 실패');
      }

      setUser({ username: data.studentCode });
      onSuccess();
      return null;
    } catch (err: any) {
      captureException(err);
      return err.message;
    }
  }, null);

  return (
    <form action={submitAction} className={styles.formContainer}>
      <TextField
        name="username"
        placeholder="학번을 입력해주세요"
        value={username}
        onChange={e => setUsername(e.target.value)}
        error={Boolean(error)}
      />
      <TextField
        name="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={Boolean(error)}
      />
      {error && (
        <div className={styles.errorMessage}>
          {error.split('\n').map((line: string, i: number) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
      <FixedButton type="submit" disabled={!username || !password || isPending} isLoading={isPending}>
        학교 연동하기
      </FixedButton>
    </form>
  );
}
