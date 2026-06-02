import { useSuspenseQuery } from '@tanstack/react-query';
import { academicQueryKeys } from '../queryKey';
import { fetchLanguageCertRequirement } from '../service';

/** 외국어 인증 기준(학과·입학년도별 시험 통과 기준) 조회. */
export function useLanguageCertRequirementQuery() {
  return useSuspenseQuery({
    queryKey: academicQueryKeys.languageCertRequirement(),
    queryFn: fetchLanguageCertRequirement,
  });
}
