import { z } from 'zod';

/**
 * 참고 석차 API 계약 (cchaksa-backend PR #378, 머지 전).
 * dev Swagger 에 반영되면 생성 타입으로 교체하고 이 스키마는 응답 검증 용도만 남긴다.
 */
const nullable = <T extends z.ZodTypeAny>(schema: T) => schema.nullish().transform(value => value ?? null);

export const referenceRankStatusSchema = z.enum(['EXACT', 'TIED', 'UNRESOLVED', 'UNAVAILABLE', 'INSUFFICIENT_PEERS']);

export const referenceRankSchema = z.object({
  cohort: nullable(
    z.object({
      year: z.number(),
      semester: z.number(),
      majorCode: z.string(),
      majorName: nullable(z.string()),
      gradeLevel: z.number(),
    })
  ),
  status: referenceRankStatusSchema,
  rank: nullable(z.number()),
  rankFrom: nullable(z.number()),
  rankTo: nullable(z.number()),
  participantCount: nullable(z.number()),
  tiedCount: nullable(z.number()),
  reasons: z.array(z.string()),
  dataAsOf: nullable(z.string()),
  calculatedAt: z.string(),
  rulesVersion: z.string(),
});

export type ReferenceRankStatus = z.infer<typeof referenceRankStatusSchema>;
export type ReferenceRank = z.infer<typeof referenceRankSchema>;
