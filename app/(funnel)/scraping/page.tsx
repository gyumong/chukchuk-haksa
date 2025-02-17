'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { useStudentInfo } from '../contexts';

export default function ScrapingPage() {
  const [, setTaskId] = useState<string | null>(null);
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
          name: '척척이',
          majorName: '척척학과' ,
          studentCode: '17019013',
          gradeLevel: '4',
          completedSemesters: '2',
          status: 0,
          school: '수원대학교',
        };

        setStudentInfo(studentData);
        router.push('/complete');
        return;
      } else if (result.status === 'failed') {
        setError(result.data?.message || '크롤링 중 오류가 발생했습니다.');
      } else {
        // 아직 진행 중이면 계속 폴링
        setTimeout(() => pollProgress(taskId), 2000);
      }
    } catch (err: any) {
      setError(err.message);
      return;
    }
  };

  if (error) {
    throw new Error(error);
  }

  return <LoadingScreen />;
}
