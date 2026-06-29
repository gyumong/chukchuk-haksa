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
  drafts: LectureEvaluationDraft[]
): SubmitLectureEvaluationsRequest {
  return {
    year,
    semester,
    evaluations: drafts.map(draft => {
      const review = draft.review.trim();

      return {
        courseId: draft.courseId,
        professorId: draft.professorId,
        selectedTags: draft.selectedTags,
        ...(review ? { review } : {}),
      };
    }),
  };
}
