export const LECTURE_EVALUATION_TAGS = [
  'LOW_HOMEWORK',
  'INTERESTING_CLASS',
  'LOW_TEAM_PROJECT',
  'EXAM_REPLACED_BY_HOMEWORK',
  'ONLINE_EXAM',
  'PASS_FAIL',
  'ABSOLUTE_GRADING',
  'EASY_GRADE',
] as const;

export type LectureEvaluationTag = (typeof LECTURE_EVALUATION_TAGS)[number];

export interface LectureEvaluationGrade {
  courseName: string;
  courseCode: string;
  courseId: number;
  areaType: string;
  credits: number;
  professor: string;
  professorId: number;
  grade: string;
  score: number | null;
  liberalAreaCode?: number;
}

export interface LectureEvaluationRequired {
  lectureEvaluationRequired: boolean;
  year: number;
  semester: number;
  grades: LectureEvaluationGrade[];
}

export interface LectureEvaluationDraft {
  courseId: number;
  professorId: number;
  selectedTags: LectureEvaluationTag[];
  review: string;
}

export interface LectureEvaluationSubmission {
  courseId: number;
  professorId: number;
  selectedTags: LectureEvaluationTag[];
  review?: string;
}

export interface SubmitLectureEvaluationsRequest {
  year: number;
  semester: number;
  evaluations: LectureEvaluationSubmission[];
}
