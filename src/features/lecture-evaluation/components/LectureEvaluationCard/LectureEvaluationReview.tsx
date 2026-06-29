'use client';

import React, { memo, useCallback, useSyncExternalStore } from 'react';
import type { LectureEvaluationDraftStore } from '../../utils/draftStore';
import styles from './LectureEvaluationCard.module.scss';

interface LectureEvaluationReviewProps {
  index: number;
  inputId: string;
  store: LectureEvaluationDraftStore;
}

function LectureEvaluationReviewComponent({ index, inputId, store }: LectureEvaluationReviewProps) {
  const subscribe = useCallback((listener: () => void) => store.subscribeReview(index, listener), [index, store]);
  const getSnapshot = useCallback(() => store.getReview(index), [index, store]);
  const review = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const handleReviewChange = useCallback(
    (value: string) => {
      store.updateReview(index, value);
    },
    [index, store]
  );

  return (
    <div className={styles.reviewField}>
      <label className={styles.legend} htmlFor={inputId}>
        수강후기(선택)
      </label>
      <textarea
        id={inputId}
        className={styles.review}
        value={review}
        maxLength={2000}
        placeholder={'수강하면서 느낀 점을 자유롭게 남겨주세요.\n(ex. 출석 중요, 팀플 2인 1조 등)'}
        onChange={event => handleReviewChange(event.target.value)}
      />
    </div>
  );
}

export const LectureEvaluationReview = memo(LectureEvaluationReviewComponent);
