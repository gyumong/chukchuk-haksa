'use client';

import { useEffect, useRef, useState } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { useStudentInfo } from '../contexts';

export default function ScrapingPage() {
  const [, setTaskId] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const isStarting = useRef(false);
  const router = useInternalRouter();
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
      setErrorCode(500);
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
          name: result.data?.studentInfo.name ?? '',
          majorName: result.data?.studentInfo.majorName ?? '',
          studentCode: result.data?.studentInfo.studentCode ?? '',
          gradeLevel: result.data?.studentInfo.gradeLevel ?? '',
          completedSemesters: result.data?.studentInfo.completedSemesters ?? '',
          status: result.data?.studentInfo.status ?? 0,
          school: '수원대학교',
        };

        setStudentInfo(studentData);
        router.push('/complete');
        return;
      } else if (result.status === 'failed') {
        if (result.data?.status === 401) {
          setErrorCode(401);
        } else if (result.data?.status === 423) {
          setErrorCode(423);
        } else {
          setErrorCode(500);
        }
      } else {
        // 아직 진행 중이면 계속 폴링
        setTimeout(() => pollProgress(taskId), 2000);
      }
    } catch (err: any) {
      setErrorCode(500);
    }
  };

  if (errorCode) {
    if (errorCode === 401) {
      throw new Error('아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.');
    } else if (errorCode === 423) {
      throw new Error('계정이 잠겼습니다. 포털사이트로 돌아가서 학번/사번 찾기 및 비밀번호 재발급을 진행해주세요');
    } else {
      throw new Error('알 수 없는 오류가 발생했어요 \n 잠시후 다시 시도해주세요');
    }
  }

  return <LoadingScreen />;
}
