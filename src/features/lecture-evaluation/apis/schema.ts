import { z } from 'zod';
import { LECTURE_EVALUATION_STATUSES, LECTURE_EVALUATION_TAGS } from '../types';

export const LectureEvaluationTagSchema = z.enum(LECTURE_EVALUATION_TAGS);
export const LectureEvaluationStatusSchema = z.enum(LECTURE_EVALUATION_STATUSES);

export const LectureEvaluationGradeSchema = z.object({
  courseName: z.string(),
  courseCode: z.string(),
  courseId: z.number(),
  areaType: z.string(),
  credits: z.number(),
  professor: z.string(),
  professorId: z.number(),
  grade: z.string(),
  score: z.number().nullable(),
  liberalAreaCode: z.number().optional(),
});

export const LectureEvaluationStatusResponseSchema = z
  .object({
    evaluationStatus: LectureEvaluationStatusSchema,
    year: z.number(),
    semester: z.number(),
    grades: z.array(LectureEvaluationGradeSchema),
  })
  .superRefine((value, context) => {
    if (value.evaluationStatus !== 'PENDING' && value.grades.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grades'],
        message: 'PENDING이 아닌 강의평가 상태의 grades는 비어 있어야 합니다.',
      });
    }

    if (value.evaluationStatus === 'PENDING' && value.grades.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grades'],
        message: 'PENDING 상태에는 평가 대상 과목이 있어야 합니다.',
      });
    }

    if (value.grades.some(course => course.grade === 'IP')) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grades'],
        message: 'IP 성적 과목은 강의평가 대상에 포함될 수 없습니다.',
      });
    }
  });

export const SubmitLectureEvaluationsRequestSchema = z.object({
  year: z.number(),
  semester: z.number(),
  evaluations: z
    .array(
      z.object({
        courseId: z.number(),
        professorId: z.number(),
        selectedTags: z.array(LectureEvaluationTagSchema),
        review: z.string().max(2000).optional(),
      })
    )
    .min(1),
});

export const SkipLectureEvaluationRequestSchema = z.object({
  year: z.number(),
  semester: z.number(),
});
