'use client';

import { useCallback, useMemo, useState } from 'react';
import type { LectureEvaluationGrade } from '../types';
import { createLectureEvaluationDraftStore, createLectureEvaluationSessionKey } from '../utils/draftStore';
import { buildSubmitLectureEvaluationsRequest } from '../utils/evaluationDraft';

interface UseLectureEvaluationFormParams {
  year: number;
  semester: number;
  grades: LectureEvaluationGrade[];
}

export function useLectureEvaluationForm({ year, semester, grades }: UseLectureEvaluationFormParams) {
  const sessionKey = createLectureEvaluationSessionKey(year, semester, grades);
  const [navigation, setNavigation] = useState({ sessionKey, index: 0 });
  // sessionKey에 학기와 grades 전체가 직렬화되어 있으므로, 동일한 데이터의 배열 참조만 바뀐 경우에는 초안을 유지한다.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const draftStore = useMemo(() => createLectureEvaluationDraftStore(grades), [sessionKey]);

  const currentIndex = navigation.sessionKey === sessionKey ? navigation.index : 0;
  const currentGrade = grades[currentIndex];
  const isLast = currentIndex === grades.length - 1;

  const goNext = useCallback(() => {
    setNavigation(current => ({
      sessionKey,
      index: Math.min(grades.length - 1, current.sessionKey === sessionKey ? current.index + 1 : 1),
    }));
  }, [grades.length, sessionKey]);

  const getRequest = useCallback(
    () => buildSubmitLectureEvaluationsRequest(year, semester, draftStore.getDrafts()),
    [draftStore, semester, year]
  );

  return {
    currentIndex,
    currentGrade,
    draftStore,
    isLast,
    getRequest,
    goNext,
  };
}
