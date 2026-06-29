'use client';

import React, { memo, useCallback, useSyncExternalStore } from 'react';
import { LECTURE_EVALUATION_TAG_OPTIONS } from '../../constants/tags';
import type { LectureEvaluationTag } from '../../types';
import type { LectureEvaluationDraftStore } from '../../utils/draftStore';
import styles from './LectureEvaluationCard.module.scss';

interface LectureEvaluationTagsProps {
  index: number;
  store: LectureEvaluationDraftStore;
}

function LectureEvaluationTagsComponent({ index, store }: LectureEvaluationTagsProps) {
  const subscribe = useCallback((listener: () => void) => store.subscribeSelectedTags(index, listener), [index, store]);
  const getSnapshot = useCallback(() => store.getSelectedTags(index), [index, store]);
  const selectedTags = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const handleToggleTag = useCallback(
    (tag: LectureEvaluationTag) => {
      store.toggleTag(index, tag);
    },
    [index, store]
  );

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>강의평가</legend>
      <div className={styles.tagGrid}>
        {LECTURE_EVALUATION_TAG_OPTIONS.map(option => (
          <button
            key={option.value}
            type="button"
            className={styles.tagButton}
            aria-pressed={selectedTags.includes(option.value)}
            onClick={() => handleToggleTag(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export const LectureEvaluationTags = memo(LectureEvaluationTagsComponent);
