'use client';

import { useState } from 'react';

export default function ScrapePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const startScrape = async () => {
    setStatus(null);
    setData(null);
    setError(null);

    const res = await fetch('/api/suwon-scrape/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const result = await res.json();
      setError(result.error || 'Unknown error');
      return;
    }
    const { taskId } = await res.json();

    pollProgress(taskId);
  };

  const pollProgress = async (taskId: string) => {
    let attempts = 0;
    const maxAttempts = 60; // 60회 (ex. 2초 간격 -> 2분)
    while (attempts < maxAttempts) {
      await new Promise((r) => setTimeout(r, 2000));
      try {
        const res = await fetch(`/api/suwon-scrape/progress?taskId=${taskId}`);
        if (!res.ok) {
          setError('Fail to check progress');
          break;
        }
        const { status, data } = await res.json();
        if (status === 'in-progress') {
          setStatus('작업 진행중...');
        } else if (status === 'completed') {
          setStatus('작업 완료');
          setData(data);
          break;
        } else if (status === 'failed') {
          setError(data?.message || '작업 실패');
          break;
        }
      } catch (err) {
        setError((err).message);
        break;
      }
      attempts++;
    }
    if (attempts === maxAttempts) {
      setError('최대 시도 횟수를 초과했어요.');
    }
  };

  return (
    <div>
      <h2>폴링 방식 크롤링 예시</h2>
      <input
        type="text"
        placeholder="학번"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={startScrape}>크롤링 시작</button>

      {status && <p>{status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div>
          <h3>크롤링 결과</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}