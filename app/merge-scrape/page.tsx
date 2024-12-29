 'use client';

import { useState, useRef, useEffect } from 'react';

export default function MergedScrapePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [status, setStatus] = useState<string | null>(null);
  const [mergedData, setMergedData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);

  const startMergedScrape = async () => {
    setStatus(null);
    setMergedData(null);
    setError(null);

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    const res = await fetch('/api/start-merged-scrape', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error || 'Unknown error');
      return;
    }

    const { taskId } = await res.json();

    const es = new EventSource(`/api/merged-status?taskId=${taskId}`);
    eventSourceRef.current = es;

    es.onmessage = (e) => {
      const eventData = JSON.parse(e.data);
      console.log('[onmessage]', eventData);
    };

    es.addEventListener('status', (e) => {
      const eventData = JSON.parse(e.data);
      console.log('[status event]', eventData);

      if (eventData.status === 'in-progress') {
        setStatus('작업 진행중...');
      } else if (eventData.status === 'completed') {
        setStatus('작업 완료');
        setMergedData(eventData.data);
        es.close();
      } else if (eventData.status === 'failed') {
        setError(eventData.data || '작업 실패');
        es.close();
      }
    });

    es.addEventListener('error', () => {
      setError('SSE 오류 발생');
      es.close();
    });
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <h2>EventSource with useRef</h2>
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
      <button onClick={startMergedScrape}>크롤링 시작</button>

      {status && <p>상태: {status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {mergedData && (
        <div>
          <h3>크롤링 결과</h3>
          {mergedData.map((sem, i) => (
            <div key={i}>
              <h4>{sem.semester}</h4>
              <ul>
                {sem.courses.map((course: any, j: number) => (
                  <li key={j}>
                    {course.courseName}
                    {course.grade ? ` (${course.grade}점)` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}