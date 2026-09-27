import type {
  Course,
  CourseAreaType,
  DesignatedCourseProgress,
  DesignatedCourseStatus,
  TransferAreaEvaluationType,
  TransferAreaProgress,
} from '../types/graduation';
import { getCourseAreaDisplayName, sortAreasByCompletion } from './courseAreaUtils';
import { isDualMajorArea } from './dualMajorUtils';

/**
 * 편입생 영역 카드 표시용 뷰모델.
 *
 * - COMPARISON(전핵·전선): "이수 / 기준" 비교 표시. 기준은 편입연도 2년 전 일반 학생 기준의 50% 라 소수점 가능.
 * - EARNED_ONLY: 기준 없이 취득학점만 표시.
 * - UNAVAILABLE: 기준을 확인할 수 없어(복수전공 정책 미확정 등) 취득학점만 표시.
 */
export interface TransferAreaView {
  areaType: CourseAreaType;
  displayName: string;
  evaluationType: TransferAreaEvaluationType;
  /**
   * 카드에 표시할 취득학점.
   * COMPARISON 은 기준과 실제로 비교되는 countedCredits(없으면 earnedCredits) —
   * 체크 표시(fulfilled)와 숫자가 어긋나지 않게 한다. 그 외는 영역 전체 earnedCredits.
   */
  earnedCredits: number;
  /** COMPARISON 에서만 존재. 그 외는 null → 카드가 "N학점" 단독 표시로 전환. */
  requiredCredits: number | null;
  isCompleted: boolean;
  isDualMajor: boolean;
  courses: Course[];
}

/** 백엔드 DTO → 카드 뷰모델. evaluationType 누락 시 기준이 있으면 COMPARISON, 없으면 EARNED_ONLY 로 본다. */
export function toTransferAreaView(area: TransferAreaProgress): TransferAreaView {
  const areaType = area.areaType ?? '기타';
  const evaluationType: TransferAreaEvaluationType =
    area.evaluationType ?? (area.requiredCredits != null ? 'COMPARISON' : 'EARNED_ONLY');
  const requiredCredits = evaluationType === 'COMPARISON' && area.requiredCredits != null ? area.requiredCredits : null;
  const isComparison = requiredCredits != null;

  return {
    areaType,
    displayName: getCourseAreaDisplayName(areaType),
    evaluationType,
    earnedCredits: isComparison ? (area.countedCredits ?? area.earnedCredits ?? 0) : (area.earnedCredits ?? 0),
    requiredCredits,
    isCompleted: isComparison && area.fulfilled === true,
    isDualMajor: isDualMajorArea(areaType),
    courses: area.courses ?? [],
  };
}

/** 표시 순서 — 기준 비교 영역(전핵·전선) → 취득학점만 → 기준 미확정. */
const EVALUATION_ORDER: Record<TransferAreaEvaluationType, number> = {
  COMPARISON: 0,
  EARNED_ONLY: 1,
  UNAVAILABLE: 2,
};

/**
 * 편입생 영역 목록을 카드 순서대로 정렬한다.
 * COMPARISON 그룹 안에서는 기존 영역 카드와 동일하게 충족한 영역이 앞으로 온다. 나머지는 백엔드 순서 유지.
 */
export function sortTransferAreas(areas: TransferAreaView[]): TransferAreaView[] {
  const grouped = areas.reduce<Record<TransferAreaEvaluationType, TransferAreaView[]>>(
    (acc, area) => {
      acc[area.evaluationType].push(area);
      return acc;
    },
    { COMPARISON: [], EARNED_ONLY: [], UNAVAILABLE: [] }
  );

  return (Object.keys(EVALUATION_ORDER) as TransferAreaEvaluationType[])
    .sort((a, b) => EVALUATION_ORDER[a] - EVALUATION_ORDER[b])
    .flatMap(type => (type === 'COMPARISON' ? sortAreasByCompletion(grouped[type]) : grouped[type]));
}

/** 영역 DTO 배열 → 주전공/복수전공으로 나눈 정렬된 뷰모델. */
export function buildTransferAreaViews(areas: TransferAreaProgress[]) {
  const views = areas.map(toTransferAreaView);
  return {
    mainMajorAreas: sortTransferAreas(views.filter(area => !area.isDualMajor)),
    dualMajorAreas: sortTransferAreas(views.filter(area => area.isDualMajor)),
  };
}

/** 지정과목 이수 상태 라벨. status 누락은 확인 필요로 본다. */
export function getDesignatedCourseStatusLabel(status: DesignatedCourseStatus | undefined): string {
  const labels: Record<DesignatedCourseStatus, string> = {
    COMPLETED: '이수',
    NOT_COMPLETED: '미이수',
    UNKNOWN: '확인 필요',
  };
  return labels[status ?? 'UNKNOWN'];
}

/** 지정과목이 1개 이상 있고 전부 COMPLETED 이면 지정과목 카드를 완료 상태로 본다. */
export function isDesignatedCoursesCompleted(courses: DesignatedCourseProgress[]): boolean {
  return courses.length > 0 && courses.every(course => course.status === 'COMPLETED');
}
