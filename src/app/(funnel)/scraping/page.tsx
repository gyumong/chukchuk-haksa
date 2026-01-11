'use client';

import { useEffect, useRef, useState } from 'react';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import { suwonScrapingApi } from '@/shared/api/client';
import type { ScrapingApiResponse } from '@/shared/api/data-contracts';
import { ApiError } from '@/shared/api/errors';
import { ApiResponseHandler } from '@/shared/api/utils/response-handler';
import LoadingScreen from '../components/LoadingScreen/LoadingScreen';
import { useStudentInfo } from '../contexts';

type ScrapingError = {
  code: number;
  message: string;
};

const SCRAPING_ERRORS_BY_STATUS: Record<number, string> = {
  401: '아이디나 비밀번호가 일치하지 않습니다.\n학교 홈페이지에서 확인해주세요.',
  404: '사용자에게 맞는 졸업 요건 데이터가 존재하지 않습니다.\n학과/입학년도 정보를 확인해주세요.',
  409: '이미 포털 연동된 학생 정보가 존재합니다.\n다른 계정으로 로그인했는지 확인해주세요.',
  422: '입력하신 학적 정보로는 현재 처리가 불가능합니다.\n세부 사유를 확인해주세요.',
  423: '계정이 잠겼습니다. 포털사이트로 돌아가서 학번/사번 찾기 및 비밀번호 재발급을 진행해주세요',
  500: '알 수 없는 오류가 발생했어요 \n 잠시후 다시 시도해주세요',
};

// 백엔드 도메인 에러 코드 기반 메시지 (HttpStatus와 무관하게 우선 적용)
const SCRAPING_ERRORS_BY_APP_CODE: Record<string, string> = {
  S04: '이미 포털 연동된 학생 정보가 존재합니다.\n다른 계정으로 로그인했는지 확인해주세요.',
  D01: '복수전공 이수 구분 정보가 존재하지 않아 처리할 수 없습니다.\n학사정보를 확인해주세요.',
  T13: '편입생 학적 정보는 현재 지원되지 않습니다.\n추후 지원 예정입니다.',
  G02: '사용자에게 맞는 졸업 요건 데이터가 존재하지 않습니다.\n학과/입학년도 정보를 확인해주세요.',
};

const createScrapingError = (statusCode: number, appCode?: string): ScrapingError => {
  const message =
    (appCode && SCRAPING_ERRORS_BY_APP_CODE[appCode]) ||
    SCRAPING_ERRORS_BY_STATUS[statusCode] ||
    SCRAPING_ERRORS_BY_STATUS[500];

  return {
    code: statusCode,
    message,
  };
};

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

  const handleScrapingError = (statusCode: number, appCode?: string) => {
    const error = createScrapingError(statusCode, appCode);
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
      const statusCode = err?.status ?? err?.response?.status ?? 500;

      const appCode = err?.code ?? err?.data?.code ?? err?.response?.data?.code ?? err?.error?.code ?? err?.body?.code;

      handleScrapingError(statusCode, typeof appCode === 'string' ? appCode : undefined);
    }
  };

  if (error) {
    throw new ApiError(error.message, '', error.code);
  }

  return <LoadingScreen />;
}
