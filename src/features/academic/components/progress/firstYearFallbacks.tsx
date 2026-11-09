'use client';

import { ApiError } from '@/shared/api/errors';
import type { AsyncFallbackProps } from '@/shared/components/AsyncBoundary';
import { ApiErrorFallback, DefaultErrorFallback } from '@/shared/components/error-fallback';
import { getUserMessage } from '@/shared/user-messages';
import {
  FIRST_YEAR_GRADES_UNAVAILABLE,
  FIRST_YEAR_REQUIREMENTS_UNAVAILABLE,
  isApiErrorWithCode,
} from '../../utils/firstYearUnavailable';
import SemesterGradeCard from '../shared/SemesterGradeCard/SemesterGradeCard';

// AsyncBoundary 의 기본 fallback 과 같은 분기. 1학년 안내 대상이 아닌 에러는 기존처럼 보여준다.
const DefaultFallback = (props: AsyncFallbackProps) =>
  props.error instanceof ApiError ? <ApiErrorFallback {...props} /> : <DefaultErrorFallback {...props} />;

/**
 * 졸업진단 응답을 쓰는 섹션(영역별 이수현황·필수 이수내역)용.
 * G03 이면 분석할 요건 자체가 없으므로 섹션을 숨기고, 안내는 상단 FirstYearRequirementNotice 가 맡는다.
 */
export const GraduationRequirementErrorFallback = (props: AsyncFallbackProps) => {
  if (isApiErrorWithCode(props.error, FIRST_YEAR_REQUIREMENTS_UNAVAILABLE)) {
    return null;
  }
  return <DefaultFallback {...props} />;
};

/**
 * 학기별 성적 카드용. A09 면 세부 성적 조회를 비활성화하고 서버 안내 문구를 보여준다.
 * 성적이 저장된 뒤 재조회에서 200 이 오면 원래 카드로 돌아온다.
 */
export const SemesterGradeErrorFallback = (props: AsyncFallbackProps) => {
  const { error } = props;

  if (isApiErrorWithCode(error, FIRST_YEAR_GRADES_UNAVAILABLE)) {
    return <SemesterGradeCard disabledMessage={getUserMessage(error.status, error.appCode, error.message)} />;
  }
  return <DefaultFallback {...props} />;
};
