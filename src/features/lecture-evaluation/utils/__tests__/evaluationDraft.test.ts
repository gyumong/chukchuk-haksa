import { describe, expect, it } from 'vitest';
import type { LectureEvaluationGrade } from '../../types';
import {
  buildSubmitLectureEvaluationsRequest,
  createEvaluationDrafts,
  toggleEvaluationTag,
  updateEvaluationReview,
} from '../evaluationDraft';

const grades: LectureEvaluationGrade[] = [
  {
    courseName: '컴퓨터네트워크',
    courseCode: '06547',
    courseId: 1,
    areaType: '전선',
    credits: 3,
    professor: '김민규',
    professorId: 10,
    grade: 'A+',
    score: null,
  },
  {
    courseName: '운영체제',
    courseCode: '06548',
    courseId: 2,
    areaType: '전선',
    credits: 3,
    professor: '홍길동',
    professorId: 11,
    grade: 'B+',
    score: 85,
  },
];

describe('lecture evaluation draft', () => {
  it('조회된 전체 과목 순서를 유지하며 빈 평가 초안을 생성한다', () => {
    expect(createEvaluationDrafts(grades)).toEqual([
      { courseId: 1, professorId: 10, selectedTags: [], review: '' },
      { courseId: 2, professorId: 11, selectedTags: [], review: '' },
    ]);
  });

  it('태그를 복수 선택하고 다시 누르면 선택 해제한다', () => {
    const initial = createEvaluationDrafts(grades)[0];
    const selected = toggleEvaluationTag(toggleEvaluationTag(initial, 'LOW_HOMEWORK'), 'INTERESTING_LECTURE');
    const deselected = toggleEvaluationTag(selected, 'LOW_HOMEWORK');

    expect(selected.selectedTags).toEqual(['LOW_HOMEWORK', 'INTERESTING_LECTURE']);
    expect(deselected.selectedTags).toEqual(['INTERESTING_LECTURE']);
  });

  it('후기는 최대 2,000자로 제한한다', () => {
    const initial = createEvaluationDrafts(grades)[0];
    expect(updateEvaluationReview(initial, 'a'.repeat(2100)).review).toHaveLength(2000);
  });

  it('학기 전체 과목을 일괄 제출 요청으로 만들고 후기 양끝 공백을 제거한다', () => {
    const drafts = createEvaluationDrafts(grades);
    drafts[0] = {
      ...drafts[0],
      selectedTags: ['LOW_HOMEWORK'],
      review: '  출석이 중요해요.  ',
    };

    expect(buildSubmitLectureEvaluationsRequest(2026, 10, drafts)).toEqual({
      year: 2026,
      semester: 10,
      evaluations: [
        {
          courseId: 1,
          professorId: 10,
          selectedTags: ['LOW_HOMEWORK'],
          review: '출석이 중요해요.',
        },
        {
          courseId: 2,
          professorId: 11,
          selectedTags: [],
        },
      ],
    });
  });
});
