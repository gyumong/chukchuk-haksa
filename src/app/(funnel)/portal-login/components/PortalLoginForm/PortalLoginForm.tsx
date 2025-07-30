'use client';

import { useState } from 'react';
import { FixedButton, TextField } from '@/components/ui';
import { usePortalLoginMutation } from '@/features/auth/apis/queries/usePortalLoginMutation';
import styles from './PortalLoginForm.module.scss';

interface PortalLoginFormProps {
  onSuccess: (studentCode: string) => void;
  onError?: (error: Error) => void;
}

export function PortalLoginForm({ onSuccess, onError }: PortalLoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const mutation = usePortalLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await mutation.mutateAsync({ username, password });
      onSuccess(username);
    } catch (err) {
      onError?.(err as Error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <TextField
        name="username"
        placeholder="학번을 입력해주세요"
        value={username}
        onChange={e => setUsername(e.target.value)}
        error={Boolean(mutation.error)}
      />
      <TextField
        name="password"
        type="password"
        placeholder="비밀번호를 입력해주세요"
        value={password}
        onChange={e => setPassword(e.target.value)}
        error={Boolean(mutation.error)}
      />
      {mutation.error && (
        <div className={styles.errorMessage}>
          {mutation.error.message.split('\n').map((line: string, i: number) => (
            <p key={i}>{line}</p>
          ))}
        </div>
      )}
      <FixedButton type="submit" disabled={!username || !password || mutation.isPending} isLoading={mutation.isPending}>
        학교 연동하기
      </FixedButton>
    </form>
  );
}
