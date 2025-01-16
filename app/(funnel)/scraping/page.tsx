'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentInfo } from '../contexts';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';

export default function ScrapingPage() {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [isScrapingDone, setIsScrapingDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isStarting = useRef(false);
  const router = useRouter();
  const { setStudentInfo } = useStudentInfo();

  useEffect(() => {
    if (!isStarting.current) {
      isStarting.current = true;
      startScrape();
    }

    return () => {
      isStarting.current = false;
    };
  }, []);

  const startScrape = async () => {
    try {
      const response = await fetch('/api/suwon-scrape/start', {
        method: 'POST',
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || '크롤링 시작에 실패했습니다.');
      }

      setTaskId(result.taskId);
      pollProgress(result.taskId);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const pollProgress = async (taskId: string) => {
    try {
      const response = await fetch(`/api/suwon-scrape/progress?taskId=${taskId}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch progress');
      }

      if (result.status === 'completed') {
        const studentData = {
          name: result.data.student.name ?? '',
          majorName: result.data.student.majorName ?? '',
          studentCode: result.data.student.studentCode ?? '',
          gradeLevel: result.data.student.gradeLevel ?? '',
          completedSemesters: result.data.student.completedSemesters ?? '',
          status: result.data.student.status ?? 0,
          school: '수원대학교',
        };

        setStudentInfo(studentData);
        setIsScrapingDone(true);
      } else if (result.status === 'failed') {
        setError(result.data?.message || '크롤링 중 오류가 발생했습니다.');
      } else {
        // 아직 진행 중이면 계속 폴링
        setTimeout(() => pollProgress(taskId), 2000);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <LoadingScreen 
      targetPath="/complete"
      minRepeatCount={3}
      onComplete={(currentRepeatCount) => {
        // API 응답이 완료되고 최소 3번 이상 반복된 경우에만 이동
        if (isScrapingDone && currentRepeatCount >= 3) {
          router.push('/complete');
        }
      }}
    />
  );
}