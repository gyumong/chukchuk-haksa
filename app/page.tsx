'use client';

import { useState } from 'react';

export default function MergedScrapePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [mergedData, setMergedData] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // 상태를 이벤트 기반으로 업데이트하는 핸들러
  const handleEvent = (eventData: any) => {
    console.log('Received SSE event:', eventData);

    if (eventData.status === 'in-progress') {
      setStatus('작업 진행중...');
    } else if (eventData.status === 'completed') {
      setStatus('작업 완료');
      setMergedData(eventData.data);
    } else if (eventData.status === 'failed') {
      setStatus(null);
      setError(eventData.data || '작업 실패');
    }
  };

  const startScrape = async () => {
    setStatus(null);
    setError(null);
    setMergedData(null);
    if (eventSource) {
      eventSource.close();
      setEventSource(null);
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

    // SSE 연결
    const es = new EventSource(`/api/merged-status?taskId=${taskId}`);
    setEventSource(es);

    es.onmessage = (e) => {
      // onmessage: 기본 event
      const eventData = JSON.parse(e.data);
      console.log('onmessage', eventData);
    };

    es.addEventListener('status', (e: MessageEvent) => {
      const eventData = JSON.parse(e.data);
      handleEvent(eventData);
      if (eventData.status === 'completed' || eventData.status === 'failed') {
        es.close();
      }
    });

    es.addEventListener('error', () => {
      setError('SSE 오류 발생');
      es.close();
    });
  };

  return (
    <div>
      <h2>이벤트 기반 상태 업데이트 (SSE)</h2>
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

      {status && <p>현재 상태: {status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {mergedData && (
        <div>
          <h3>결과</h3>
          {mergedData.map((sem, i) => (
            <div key={i}>
              <h4>{sem.semester}</h4>
              <ul>
                {sem.courses.map((course: any, j: number) => (
                  <li key={j}>
                    {course.courseName}
                    {course.grade ? `(${course.grade}점)` : ''}
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