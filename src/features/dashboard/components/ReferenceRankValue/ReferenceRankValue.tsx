'use client';

import { useReferenceRankQuery } from '@/features/academic/apis/queries/useReferenceRankQuery';
import { useSemesterListQuery } from '@/features/academic/apis/queries/useSemesterListQuery';
import {
  getLatestRegularSemester,
  getReferenceRankValue,
  REFERENCE_RANK_EMPTY,
} from '@/features/academic/utils/referenceRankView';
import AsyncBoundary from '@/shared/components/AsyncBoundary';
import styles from './ReferenceRankValue.module.scss';

const COMPACT_LENGTH = 7;
const COMPACT_RANGE_LENGTH = 6;

const EmptyValue = () => <>{REFERENCE_RANK_EMPTY}</>;

// 범위 값의 '위'는 숫자보다 폭이 넓어 더 짧은 길이부터 줄인다.
const isCompactValue = (value: string) =>
  value.length > (value.endsWith('위') ? COMPACT_RANGE_LENGTH : COMPACT_LENGTH);

export const ReferenceRankText = ({ value }: { value: string }) => (
  <span className={isCompactValue(value) ? styles.compact : undefined}>{value}</span>
);

function TermRankValue({ year, semester }: { year: number; semester: number }) {
  const { data } = useReferenceRankQuery(year, semester);

  return <ReferenceRankText value={getReferenceRankValue(data)} />;
}

function LatestTermRankValue() {
  const { data: semesters } = useSemesterListQuery();
  const term = getLatestRegularSemester(semesters);

  if (!term) {
    return <EmptyValue />;
  }

  return <TermRankValue year={term.year} semester={term.semester} />;
}

// 석차 조회가 실패해도 취득학점·평점이 있는 카드 전체가 깨지지 않도록 칸 단위로 격리한다.
const ReferenceRankValue = () => (
  <AsyncBoundary suspenseFallback={<EmptyValue />} customErrorFallback={EmptyValue}>
    <LatestTermRankValue />
  </AsyncBoundary>
);

export default ReferenceRankValue;
