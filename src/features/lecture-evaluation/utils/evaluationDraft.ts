import type {
  LectureEvaluationDraft,
  LectureEvaluationGrade,
  LectureEvaluationTag,
  SubmitLectureEvaluationsRequest,
} from '../types';

export function createEvaluationDrafts(grades: LectureEvaluationGrade[]): LectureEvaluationDraft[] {
  return grades.map(({ courseId, professorId }) => ({
    courseId,
    professorId,
    selectedTags: [],
    review: '',
  }));
}

export function toggleEvaluationTag(draft: LectureEvaluationDraft, tag: LectureEvaluationTag): LectureEvaluationDraft {
  const selectedTags = draft.selectedTags.includes(tag)
    ? draft.selectedTags.filter(selectedTag => selectedTag !== tag)
    : [...draft.selectedTags, tag];

  return {
    ...draft,
    selectedTags,
  };
}

export function updateEvaluationReview(draft: LectureEvaluationDraft, review: string): LectureEvaluationDraft {
  return {
    ...draft,
    review: review.slice(0, 2000),
  };
}

export function buildSubmitLectureEvaluationsRequest(
  year: number,
  semester: number,
  drafts: readonly LectureEvaluationDraft[]
): SubmitLectureEvaluationsRequest {
  return {
    year,
    semester,
    evaluations: drafts.map(draft => {
      // updateEvaluationReview 를 거치지 않은 draft 도 안전하도록 제출 직전 한 번 더 2000자로 제한한다.
      const review = draft.review.trim().slice(0, 2000);

      return {
        courseId: draft.courseId,
        professorId: draft.professorId,
        selectedTags: draft.selectedTags,
        ...(review ? { review } : {}),
      };
    }),
  };
}
