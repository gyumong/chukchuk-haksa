import type { LectureEvaluationTag } from '../types';

export const LECTURE_EVALUATION_TAG_OPTIONS: ReadonlyArray<{
  value: LectureEvaluationTag;
  label: string;
}> = [
  { value: 'LOW_HOMEWORK', label: '과제가 적어요' },
  { value: 'LOW_TEAM_PROJECT', label: '팀플이 적어요' },
  { value: 'ONLINE_EXAM', label: '온라인 시험이에요' },
  { value: 'EXAM_REPLACED_BY_HOMEWORK', label: '시험이 대체과제에요' },
  { value: 'INTERESTING_LECTURE', label: '수업이 재밌어요' },
  { value: 'INFORMATIVE_LECTURE', label: '강의가 유익해요' },
  { value: 'ABSOLUTE_EXAM', label: '절대평가예요' },
  { value: 'EASY_GRADE', label: '학점 따기 쉬워요' },
];
