'use client';

import { useEffect, useRef, useState } from 'react';
import { SchoolCard } from '../(funnel)/components';

export default function SuwonScrapePage() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const isStarting = useRef(false); // 중복 시작 방지를 위한 ref

  useEffect(() => {
    // 이미 시작 중이면 추가 호출 방지
    if (!isStarting.current) {
      isStarting.current = true;
      startScrape();
    }

    // cleanup
    return () => {
      isStarting.current = false;
    };
  }, []);

  /**
   * 폴링 로직: taskId가 있고, isPolling이 true면 일정 주기로 진행 상태 조회
   */
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
            setIsPolling(false); // 완료 시 폴링 중단
          } else if (result.status === 'failed') {
            setError(result.data?.message || '크롤링 중 오류가 발생했습니다.');
            setIsPolling(false);
          }
        } catch (err: any) {
          setError(err.message);
          setIsPolling(false);
        }
      }, 2000); // 2초에 한 번씩
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPolling, taskId]);

  /**
   * /api/suwon-scrape/start 호출 → taskId 세팅 → 폴링 시작
   */
  const startScrape = async () => {
    // 이미 진행 중인 경우 중복 실행 방지
    if (isPolling) {
      return;
    }

    setError(null);
    setStatus(null);
    setData(null);

    try {
      const response = await fetch('/api/suwon-scrape/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || '크롤링 시작에 실패했습니다.');
      }

      setTaskId(result.taskId);
      setIsPolling(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      isStarting.current = false; // 시작 완료 후 플래그 리셋
    }
  };

  return (
    <div>
      <div>
        <SchoolCard schoolName="수원대학교" />

        {/* 에러 메시지 */}
        {error && <p>에러: {error}</p>}

        {/* Task ID / 진행상태 / 결과 */}
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
}
