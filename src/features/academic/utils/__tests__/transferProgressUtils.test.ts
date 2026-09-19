import { describe, expect, it } from 'vitest';
import type { TransferAreaProgress } from '../../types/graduation';
import {
  buildTransferAreaViews,
  getDesignatedCourseStatusLabel,
  isDesignatedCoursesCompleted,
  sortTransferAreas,
  toTransferAreaView,
} from '../transferProgressUtils';

function makeArea(overrides: Partial<TransferAreaProgress> = {}): TransferAreaProgress {
  return {
    areaType: '전핵',
    evaluationType: 'COMPARISON',
    earnedCredits: 12,
    countedCredits: 12,
    requiredCredits: 10.5,
    fulfilled: true,
    courses: [],
    requiredCourses: [],
    unavailableReasons: [],
    ...overrides,
  };
}

describe('toTransferAreaView', () => {
  it('COMPARISON 영역은 기준학점(소수점 유지)과 충족 여부를 그대로 노출한다', () => {
    const view = toTransferAreaView(makeArea());
    expect(view.displayName).toBe('전공핵심');
    expect(view.requiredCredits).toBe(10.5);
    expect(view.earnedCredits).toBe(12);
    expect(view.isCompleted).toBe(true);
  });

  it('COMPARISON 영역은 체크 표시와 어긋나지 않도록 countedCredits 를 표시 학점으로 쓴다', () => {
    const view = toTransferAreaView(makeArea({ earnedCredits: 15, countedCredits: 9, fulfilled: false }));
    expect(view.earnedCredits).toBe(9);
    expect(view.isCompleted).toBe(false);
  });

  it('countedCredits 가 없으면 earnedCredits 로 대체한다', () => {
    const view = toTransferAreaView(makeArea({ countedCredits: null, earnedCredits: 7 }));
    expect(view.earnedCredits).toBe(7);
  });

  it('EARNED_ONLY 영역은 기준학점이 없고 완료 상태가 되지 않는다', () => {
    const view = toTransferAreaView(
      makeArea({
        areaType: '중핵',
        evaluationType: 'EARNED_ONLY',
        earnedCredits: 9,
        requiredCredits: null,
        fulfilled: null,
      })
    );
    expect(view.requiredCredits).toBeNull();
    expect(view.earnedCredits).toBe(9);
    expect(view.isCompleted).toBe(false);
  });

  it('UNAVAILABLE 영역은 기준이 있어도 비교 표시를 하지 않는다', () => {
    const view = toTransferAreaView(makeArea({ evaluationType: 'UNAVAILABLE', requiredCredits: 10, fulfilled: true }));
    expect(view.requiredCredits).toBeNull();
    expect(view.isCompleted).toBe(false);
  });

  it('evaluationType 이 누락되면 기준학점 유무로 판단한다', () => {
    expect(toTransferAreaView(makeArea({ evaluationType: undefined })).evaluationType).toBe('COMPARISON');
    expect(toTransferAreaView(makeArea({ evaluationType: undefined, requiredCredits: null })).evaluationType).toBe(
      'EARNED_ONLY'
    );
  });

  it('필드가 비어 있어도 안전한 기본값을 준다', () => {
    const view = toTransferAreaView({});
    expect(view.areaType).toBe('기타');
    expect(view.earnedCredits).toBe(0);
    expect(view.requiredCredits).toBeNull();
    expect(view.courses).toEqual([]);
  });
});

describe('sortTransferAreas', () => {
  it('기준 비교 영역 → 취득학점만 → 기준 미확정 순으로 정렬하고, 비교 영역은 충족한 것이 앞에 온다', () => {
    const views = [
      makeArea({ areaType: '중핵', evaluationType: 'EARNED_ONLY', requiredCredits: null }),
      makeArea({ areaType: '전선', fulfilled: false }),
      makeArea({ areaType: '복핵', evaluationType: 'UNAVAILABLE', requiredCredits: null }),
      makeArea({ areaType: '전핵', fulfilled: true }),
      makeArea({ areaType: '기교', evaluationType: 'EARNED_ONLY', requiredCredits: null }),
    ].map(toTransferAreaView);

    expect(sortTransferAreas(views).map(v => v.areaType)).toEqual(['전핵', '전선', '중핵', '기교', '복핵']);
  });

  it('원본 배열을 변경하지 않는다', () => {
    const views = [makeArea({ areaType: '전선' }), makeArea({ areaType: '전핵' })].map(toTransferAreaView);
    const copy = [...views];
    sortTransferAreas(views);
    expect(views).toEqual(copy);
  });
});

describe('buildTransferAreaViews', () => {
  it('복수전공 영역(복선·복핵·복교)을 분리한다', () => {
    const { mainMajorAreas, dualMajorAreas } = buildTransferAreaViews([
      makeArea({ areaType: '전핵' }),
      makeArea({ areaType: '복선', evaluationType: 'UNAVAILABLE', requiredCredits: null }),
    ]);
    expect(mainMajorAreas.map(v => v.areaType)).toEqual(['전핵']);
    expect(dualMajorAreas.map(v => v.areaType)).toEqual(['복선']);
  });
});

describe('getDesignatedCourseStatusLabel', () => {
  it('상태별 라벨을 반환하고 누락은 확인 필요로 본다', () => {
    expect(getDesignatedCourseStatusLabel('COMPLETED')).toBe('이수');
    expect(getDesignatedCourseStatusLabel('NOT_COMPLETED')).toBe('미이수');
    expect(getDesignatedCourseStatusLabel('UNKNOWN')).toBe('확인 필요');
    expect(getDesignatedCourseStatusLabel(undefined)).toBe('확인 필요');
  });
});

describe('isDesignatedCoursesCompleted', () => {
  it('전부 COMPLETED 일 때만 true, 빈 목록은 false', () => {
    expect(isDesignatedCoursesCompleted([])).toBe(false);
    expect(isDesignatedCoursesCompleted([{ status: 'COMPLETED' }, { status: 'COMPLETED' }])).toBe(true);
    expect(isDesignatedCoursesCompleted([{ status: 'COMPLETED' }, { status: 'UNKNOWN' }])).toBe(false);
  });
});
