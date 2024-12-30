'use client';
import React, { useState, useEffect } from 'react';

const SuwonScrapePage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (isPolling && taskId) {
      intervalId = setInterval(async () => {
        try {
          const response = await fetch(`/api/suwon-scrape/progress?taskId=${taskId}`);
          const result = await response.json();

          if (!response.ok) {
            throw new Error(result.error || 'Failed to fetch progress');
          }

          setStatus(result.status);
          if (result.status === 'completed') {
            setData(result.data);
            setIsPolling(false); // Stop polling when completed
          } else if (result.status === 'failed') {
            setError(result.data?.message || 'An error occurred during scraping');
            setIsPolling(false);
          }
        } catch (err: any) {
          setError(err.message);
          setIsPolling(false);
        }
      }, 2000); // Poll every 2 seconds
    }

    return () => {
      if (intervalId) {clearInterval(intervalId);}
    };
  }, [isPolling, taskId]);

  const startScrape = async () => {
    setError(null);
    setStatus(null);
    setData(null);

    try {
      const response = await fetch('/api/suwon-scrape/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to start scrape');
      }

      setTaskId(result.taskId);
      setIsPolling(true); // Start polling
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>수원대학교 크롤링 테스트</h1>
      <div style={{ marginBottom: '20px' }}>
        <label>
          학번/ID:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <label>
          비밀번호:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>
      <button onClick={startScrape} style={{ marginRight: '10px' }}>
        크롤링 시작
      </button>
      <div style={{ marginTop: '20px' }}>
        {error && <p style={{ color: 'red' }}>에러: {error}</p>}
        {taskId && <p>Task ID: {taskId}</p>}
        {status && <p>상태: {status}</p>}
        {data && (
          <div>
            <h3>크롤링 결과:</h3>
            <pre>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuwonScrapePage;