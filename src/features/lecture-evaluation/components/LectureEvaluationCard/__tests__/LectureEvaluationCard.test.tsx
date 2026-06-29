import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { LectureEvaluationGrade } from '../../../types';
import { createLectureEvaluationDraftStore } from '../../../utils/draftStore';
import { LectureEvaluationCard } from '../LectureEvaluationCard';

describe('LectureEvaluationCard', () => {
  it('score가 null이면 점수 텍스트를 렌더링하지 않는다', () => {
    const grade: LectureEvaluationGrade = {
      courseName: '진로설계',
      courseCode: '00001',
      courseId: 1,
      areaType: '교양선택',
      credits: 1,
      professor: '김민규',
      professorId: 10,
      grade: 'P',
      score: null,
    };
    const markup = renderToStaticMarkup(
      <LectureEvaluationCard
        year={2026}
        semesterLabel="1학기"
        grade={grade}
        draftIndex={0}
        draftStore={createLectureEvaluationDraftStore([grade])}
      />
    );

    expect(markup).toContain('>P<');
    expect(markup).not.toContain('data-testid="lecture-evaluation-score"');
  });
});
