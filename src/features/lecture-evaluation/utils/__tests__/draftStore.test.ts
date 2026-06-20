import { describe, expect, it, vi } from 'vitest';
import type { LectureEvaluationGrade } from '../../types';
import { createLectureEvaluationDraftStore, createLectureEvaluationSessionKey } from '../draftStore';

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
    score: 98,
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

describe('createLectureEvaluationDraftStore', () => {
  it('태그 변경은 태그 구독자에게만 알린다', () => {
    const store = createLectureEvaluationDraftStore(grades);
    const tagListener = vi.fn();
    const reviewListener = vi.fn();
    store.subscribeSelectedTags(0, tagListener);
    store.subscribeReview(0, reviewListener);

    store.toggleTag(0, 'LOW_HOMEWORK');

    expect(store.getSelectedTags(0)).toEqual(['LOW_HOMEWORK']);
    expect(tagListener).toHaveBeenCalledOnce();
    expect(reviewListener).not.toHaveBeenCalled();
  });

  it('후기 변경은 후기 구독자에게만 알리고 2,000자로 제한한다', () => {
    const store = createLectureEvaluationDraftStore(grades);
    const tagListener = vi.fn();
    const reviewListener = vi.fn();
    store.subscribeSelectedTags(0, tagListener);
    store.subscribeReview(0, reviewListener);

    store.updateReview(0, 'a'.repeat(2100));

    expect(store.getReview(0)).toHaveLength(2000);
    expect(reviewListener).toHaveBeenCalledOnce();
    expect(tagListener).not.toHaveBeenCalled();
  });

  it('여러 과목의 입력을 하나의 제출 가능한 초안 목록으로 보존한다', () => {
    const store = createLectureEvaluationDraftStore(grades);
    store.toggleTag(0, 'LOW_HOMEWORK');
    store.updateReview(1, '시험 범위가 넓어요.');

    expect(store.getDrafts()).toEqual([
      {
        courseId: 1,
        professorId: 10,
        selectedTags: ['LOW_HOMEWORK'],
        review: '',
      },
      {
        courseId: 2,
        professorId: 11,
        selectedTags: [],
        review: '시험 범위가 넓어요.',
      },
    ]);
  });
});

describe('createLectureEvaluationSessionKey', () => {
  it('target 학기나 평가 대상 과목이 바뀌면 다른 세션 키를 만든다', () => {
    const original = createLectureEvaluationSessionKey(2026, 10, grades);
    const changedSemester = createLectureEvaluationSessionKey(2026, 20, grades);
    const changedCourses = createLectureEvaluationSessionKey(2026, 10, grades.slice(0, 1));
    const changedGradeResult = createLectureEvaluationSessionKey(2026, 10, [
      {
        ...grades[0],
        grade: 'A',
        score: 95,
      },
      grades[1],
    ]);

    expect(changedSemester).not.toBe(original);
    expect(changedCourses).not.toBe(original);
    expect(changedGradeResult).not.toBe(original);
  });
});
