'use client';

import { useEffect, useRef, useState } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { suwonScrapingApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { ScrapingApiResponse } from '@/shared/api/data-contracts';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { useStudentInfo } from '../contexts';

type ScrapingError = {
  code: number;
  message: string;
};

const SCRAPING_ERRORS: Record<number, string> = {
  401: '아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.',
  423: '계정이 잠겼습니다. 포털사이트로 돌아가서 학번/사번 찾기 및 비밀번호 재발급을 진행해주세요',
  500: '알 수 없는 오류가 발생했어요 \n 잠시후 다시 시도해주세요'
};

const createScrapingError = (code: number): ScrapingError => ({
  code,
  message: SCRAPING_ERRORS[code] || SCRAPING_ERRORS[500]
});

export default function ScrapingPage() {
  const [error, setError] = useState<ScrapingError | null>(null);
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

  const handleScrapingError = (statusCode: number) => {
    const error = createScrapingError(statusCode);
    setError(error);
  };

  const startScrape = async () => {
    try {
      const response = await ApiResponseHandler.handleAsyncResponse<ScrapingApiResponse>(
        suwonScrapingApi.startScraping()
      );

      if (response.data.studentInfo) {
        setStudentInfo(response.data.studentInfo);
        router.push('/complete');
      } else {
        handleScrapingError(500);
      }
    } catch (err: any) {
      const statusCode = err.status || 500;
      handleScrapingError(statusCode);
    }
  };

  if (error) {
    throw new Error(error.message);
  }

  return <LoadingScreen />;
}
