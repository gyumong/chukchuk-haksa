import { z } from 'zod';
import { LECTURE_EVALUATION_TAGS } from '../types';

export const LectureEvaluationTagSchema = z.enum(LECTURE_EVALUATION_TAGS);

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

export const LectureEvaluationRequiredSchema = z
  .object({
    lectureEvaluationRequired: z.boolean(),
    year: z.number(),
    semester: z.number(),
    grades: z.array(LectureEvaluationGradeSchema),
  })
  .superRefine((value, context) => {
    if (!value.lectureEvaluationRequired && value.grades.length > 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grades'],
        message: '강의평가가 필요하지 않은 응답의 grades는 비어 있어야 합니다.',
      });
    }

    if (value.lectureEvaluationRequired && value.grades.length === 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['grades'],
        message: '강의평가가 필요한 응답에는 평가 대상 과목이 있어야 합니다.',
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
  evaluations: z.array(
    z.object({
      courseId: z.number(),
      professorId: z.number(),
      selectedTags: z.array(LectureEvaluationTagSchema),
      review: z.string().max(2000).optional(),
    })
  ),
});
