export const LECTURE_EVALUATION_TAGS = [
  'LOW_HOMEWORK',
  'LOW_TEAM_PROJECT',
  'ONLINE_EXAM',
  'EXAM_REPLACED_BY_HOMEWORK',
  'INTERESTING_LECTURE',
  'INFORMATIVE_LECTURE',
  'ABSOLUTE_EXAM',
  'EASY_GRADE',
] as const;

export type LectureEvaluationTag = (typeof LECTURE_EVALUATION_TAGS)[number];

export const LECTURE_EVALUATION_STATUSES = ['NOT_RELEASED', 'PENDING', 'SKIPPED', 'COMPLETED'] as const;

export type LectureEvaluationStatus = (typeof LECTURE_EVALUATION_STATUSES)[number];

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

export interface LectureEvaluationStatusResponse {
  evaluationStatus: LectureEvaluationStatus;
  year: number;
  semester: number;
  grades: LectureEvaluationGrade[];
}

export interface SkipLectureEvaluationRequest {
  year: number;
  semester: number;
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
