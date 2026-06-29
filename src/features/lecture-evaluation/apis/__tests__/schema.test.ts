import { describe, expect, it } from 'vitest';
import {
  LectureEvaluationStatusResponseSchema,
  SkipLectureEvaluationRequestSchema,
  SubmitLectureEvaluationsRequestSchema,
} from '../schema';

describe('LectureEvaluationStatusResponseSchema', () => {
  it('score null을 0으로 바꾸지 않고 유지한다', () => {
    const result = LectureEvaluationStatusResponseSchema.parse({
      evaluationStatus: 'PENDING',
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
      LectureEvaluationStatusResponseSchema.parse({
        evaluationStatus: 'PENDING',
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
      LectureEvaluationStatusResponseSchema.parse({
        evaluationStatus: 'PENDING',
        year: 2026,
        semester: 10,
        grades: [],
      })
    ).toThrow();
  });

  it.each(['NOT_RELEASED', 'SKIPPED', 'COMPLETED'] as const)('%s 상태에서 빈 성적 목록을 허용한다', status => {
    expect(
      LectureEvaluationStatusResponseSchema.parse({
        evaluationStatus: status,
        year: 2026,
        semester: 10,
        grades: [],
      })
    ).toBeDefined();
  });

  it('PENDING이 아닌 상태에 성적 목록이 포함되면 거부한다', () => {
    expect(() =>
      LectureEvaluationStatusResponseSchema.parse({
        evaluationStatus: 'COMPLETED',
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
            grade: 'A+',
            score: 95,
          },
        ],
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

  it('평가 과목이 하나도 없는 제출 요청을 거부한다', () => {
    expect(() =>
      SubmitLectureEvaluationsRequestSchema.parse({
        year: 2026,
        semester: 10,
        evaluations: [],
      })
    ).toThrow();
  });
});

describe('SkipLectureEvaluationRequestSchema', () => {
  it('target 연도와 학기를 검증한다', () => {
    expect(SkipLectureEvaluationRequestSchema.parse({ year: 2026, semester: 10 })).toEqual({
      year: 2026,
      semester: 10,
    });
  });
});
