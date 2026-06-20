import { describe, expect, it } from 'vitest';
import { LectureEvaluationRequiredSchema, SubmitLectureEvaluationsRequestSchema } from '../schema';

describe('LectureEvaluationRequiredSchema', () => {
  it('score null을 0으로 바꾸지 않고 유지한다', () => {
    const result = LectureEvaluationRequiredSchema.parse({
      lectureEvaluationRequired: true,
      year: 2026,
      semester: 10,
      grades: [
        {
          courseName: '컴퓨터네트워크',
          courseCode: '06547',
          courseId: 1,
          areaType: '전선',
          credits: 3,
          professor: '김민규',
          professorId: 10,
          grade: 'P',
          score: null,
        },
      ],
    });

    expect(result.grades[0].score).toBeNull();
  });

  it('IP 과목이 포함된 응답을 거부한다', () => {
    expect(() =>
      LectureEvaluationRequiredSchema.parse({
        lectureEvaluationRequired: true,
        year: 2026,
        semester: 10,
        grades: [
          {
            courseName: '컴퓨터네트워크',
            courseCode: '06547',
            courseId: 1,
            areaType: '전선',
            credits: 3,
            professor: '김민규',
            professorId: 10,
            grade: 'IP',
            score: null,
          },
        ],
      })
    ).toThrow();
  });

  it('평가가 필요한데 대상 과목이 없으면 거부한다', () => {
    expect(() =>
      LectureEvaluationRequiredSchema.parse({
        lectureEvaluationRequired: true,
        year: 2026,
        semester: 10,
        grades: [],
      })
    ).toThrow();
  });
});

describe('SubmitLectureEvaluationsRequestSchema', () => {
  it('빈 태그 배열과 빈 후기를 허용한다', () => {
    expect(
      SubmitLectureEvaluationsRequestSchema.parse({
        year: 2026,
        semester: 10,
        evaluations: [{ courseId: 1, professorId: 10, selectedTags: [] }],
      })
    ).toBeDefined();
  });

  it('2,000자를 초과한 후기를 거부한다', () => {
    expect(() =>
      SubmitLectureEvaluationsRequestSchema.parse({
        year: 2026,
        semester: 10,
        evaluations: [{ courseId: 1, professorId: 10, selectedTags: [], review: 'a'.repeat(2001) }],
      })
    ).toThrow();
  });
});
