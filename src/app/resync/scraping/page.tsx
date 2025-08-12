'use client';

import { useEffect, useRef, useState } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { suwonScrapingApi } from '@/shared/api/client';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import type { ScrapingApiResponse } from '@/shared/api/data-contracts';
import LoadingScreen from '../../(funnel)/components/LoadingScreen/LoadingScreen';

export default function ScrapingPage() {
  const [errorCode, setErrorCode] = useState<number | null>(null);
  const isStarting = useRef(false);
  const router = useInternalRouter();

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
      const response = await ApiResponseHandler.handleAsyncResponse<ScrapingApiResponse>(
        suwonScrapingApi.refreshAndSync()
      );

      // 재동기화 완료 시 메인 페이지로 이동
      router.push('/main');
    } catch (err: any) {
      // API 에러 처리
      if (err.status === 401) {
        setErrorCode(401);
      } else if (err.status === 423) {
        setErrorCode(423);
      } else {
        setErrorCode(500);
      }
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
