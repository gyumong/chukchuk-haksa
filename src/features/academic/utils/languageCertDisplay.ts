import type { Requirement } from '@/shared/api/data-contracts';

type RequirementTestType = NonNullable<Requirement['testType']>;

// 시험 종류 코드 → 표시 라벨. 백엔드는 testType 코드만 내려주고 표시 라벨은 프론트에서 매핑한다.
// 키를 Requirement['testType'] 계약으로 제한해 오타·비의도 키를 컴파일 타임에 차단한다.
// (TORFL_FLEX 등 일부 라벨은 실제 응답 확인 후 디자인과 맞춰 조정 필요)
export const TEST_TYPE_LABEL: Partial<Record<RequirementTestType, string>> = {
  TOEIC: 'TOEIC',
  TOEFL_IBT: 'TOEFL (IBT)',
  TEPS: 'TEPS',
  OPIC: 'OPIc',
  TOEIC_SPEAKING: 'TOEIC Speaking',
  JPT_JLPT: 'JPT/JLPT',
  NEW_HSK: '新HSK',
  TORFL_FLEX: 'TORFL/FLEX',
  DELF: 'DELF',
};

/** 시험 종류 코드를 표시 라벨로 변환. 미매핑 코드는 코드 원문을 그대로 노출한다. */
export function getTestLabel(testType: Requirement['testType']): string {
  if (!testType) {
    return '';
  }
  return TEST_TYPE_LABEL[testType] ?? testType;
}

/** displayText 를 우선 사용하고, 없을 때만 점수/등급으로 폴백 구성한다. */
export function getRequirementValue(req: Requirement): string {
  if (req.displayText) {
    return req.displayText;
  }
  if (req.minimumScore != null) {
    return `${req.minimumScore}점 이상`;
  }
  if (req.minimumGrade) {
    return `${req.minimumGrade} 이상`;
  }
  return '';
}

/** sortOrder 오름차순으로 정렬된 사본을 반환(원본 불변). */
export function sortRequirements(requirements?: Requirement[]): Requirement[] {
  return [...(requirements ?? [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
}
