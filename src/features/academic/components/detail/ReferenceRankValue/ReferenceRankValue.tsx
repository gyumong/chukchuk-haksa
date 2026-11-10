'use client';

import { useReferenceRankQuery } from '@/features/academic/apis/queries/useReferenceRankQuery';
import {
  getReferenceRankValue,
  isReferenceRankSemester,
  REFERENCE_RANK_EMPTY,
} from '@/features/academic/utils/referenceRankView';
import AsyncBoundary from '@/shared/components/AsyncBoundary';
import styles from './ReferenceRankValue.module.scss';

const COMPACT_LENGTH = 7;

interface ReferenceRankValueProps {
  year: number;
  semester: number;
}

const EmptyValue = () => <>{REFERENCE_RANK_EMPTY}</>;

// 분자(순위)만 강조색으로 두고 분모(/비교 인원)는 회색으로 낮춘다. (예: 17/66 에서 "/66")
const ReferenceRankText = ({ value }: { value: string }) => {
  const slashIndex = value.lastIndexOf('/');
  const className = value.length > COMPACT_LENGTH ? styles.compact : undefined;

  if (slashIndex < 0) {
    return <span className={className}>{value}</span>;
  }

  return (
    <span className={className}>
      {value.slice(0, slashIndex)}
      <span className={styles.denominator}>{value.slice(slashIndex)}</span>
    </span>
  );
};

function TermRankValue({ year, semester }: ReferenceRankValueProps) {
  const { data } = useReferenceRankQuery(year, semester);

  return <ReferenceRankText value={getReferenceRankValue(data)} />;
}

// 석차 조회가 실패해도 취득학점·평점이 있는 카드 전체가 깨지지 않도록 칸 단위로 격리한다.
const ReferenceRankValue = ({ year, semester }: ReferenceRankValueProps) => {
  // 참고 석차는 정규학기만 지원한다. 계절학기는 API 가 400 이므로 호출하지 않는다.
  if (!isReferenceRankSemester(semester)) {
    return <EmptyValue />;
  }

  return (
    <AsyncBoundary suspenseFallback={<EmptyValue />} customErrorFallback={EmptyValue}>
      <TermRankValue year={year} semester={semester} />
    </AsyncBoundary>
  );
};

export default ReferenceRankValue;
