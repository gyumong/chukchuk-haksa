import { useSyncExternalStore } from 'react';
import type { CreatedCourse } from '../types';

// ③-b 로 생성한 강의의 studentCourseId 보관소.
//
// 왜 필요한가: 삭제(PATCH /me/graduation-courses 의 removeStudentCourseIds)는 student_course row id 를
// 요구하는데, dev 백엔드에 그 id 를 돌려주는 읽기 API 가 하나도 없다(types.ts 의 AdminProgressRow 주석).
// 생성 응답(POST /me/test-courses → studentCourseId)이 유일한 공급원이라 여기에 쌓아둔다.
//
// localStorage 를 쓰는 이유: 계정 전환이 페이지 리로드를 동반해 메모리 스토어는 그때 통째로 날아간다.
// dev 도구의 로컬 편의 데이터일 뿐이라 개인정보는 담지 않는다(토큰·이메일 저장 안 함).

const STORAGE_KEY = 'cchaksa_admin_created_courses';
const MAX_ENTRIES = 50;

let courses: CreatedCourse[] = [];
let isHydrated = false;
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach(listener => listener());
};

function persist(): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    // 사파리 프라이빗 모드 등에서 쓰기가 막혀도 도구 자체는 계속 돌아야 한다(메모리 상태는 유지됨).
    console.warn('[admin] 생성 강의 이력 저장 실패', error);
  }
}

// 첫 스냅샷 요청 때 한 번만 localStorage 를 읽는다. 모듈 로드 시점에 읽으면 SSR 에서 window 가 없어 터진다.
function hydrate(): void {
  if (isHydrated) {
    return;
  }
  isHydrated = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw === null ? [] : JSON.parse(raw);
    if (Array.isArray(parsed)) {
      courses = parsed.filter(
        (item): item is CreatedCourse =>
          typeof item === 'object' && item !== null && typeof (item as CreatedCourse).studentCourseId === 'number'
      );
    }
  } catch (error) {
    console.warn('[admin] 생성 강의 이력 복원 실패', error);
    courses = [];
  }
}

const subscribe = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = (): CreatedCourse[] => {
  hydrate();
  return courses;
};

// 서버 렌더 스냅샷은 항상 빈 배열이어야 한다(localStorage 접근 불가). 클라이언트 hydration 후 채워진다.
const EMPTY: CreatedCourse[] = [];
const getServerSnapshot = (): CreatedCourse[] => EMPTY;

export function addCreatedCourse(course: CreatedCourse): void {
  hydrate();
  // 같은 id 가 다시 들어오면(재실행 등) 중복 행을 만들지 않는다.
  const next = [course, ...courses.filter(item => item.studentCourseId !== course.studentCourseId)];
  courses = next.slice(0, MAX_ENTRIES);
  persist();
  emit();
}

/** 삭제에 성공했거나 사용자가 목록에서 치울 때. */
export function removeCreatedCourses(studentCourseIds: number[]): void {
  hydrate();
  const removing = new Set(studentCourseIds);
  const next = courses.filter(course => !removing.has(course.studentCourseId));
  if (next.length === courses.length) {
    return;
  }
  courses = next;
  persist();
  emit();
}

export function clearCreatedCourses(): void {
  hydrate();
  if (courses.length === 0) {
    return;
  }
  courses = [];
  persist();
  emit();
}

/** 이 브라우저에서 ③-b 로 만든 강의 목록 (최신순). */
export function useCreatedCourses(): CreatedCourse[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
