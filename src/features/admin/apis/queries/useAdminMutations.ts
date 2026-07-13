import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/ui/Toast';
import type {
  CreateTestCourseRequest,
  CreateTestUserRequest,
  UpdateGraduationCoursesRequest,
  UpdateMajorRequest,
} from '@/shared/api/data-contracts';
import type { LectureEvaluationTestState } from '../../types';
import { addCreatedCourse, clearCreatedCourses, removeCreatedCourses } from '../createdCourseStore';
import {
  createTestCourse,
  createTestUser,
  resetCurrentAccount,
  setLectureEvaluationState,
  updateGraduationCourses,
  updateMajor,
} from '../service';

// 어드민 뮤테이션. 성공/실패 토스트는 여기서 공통 처리하고, 상세 응답은 감사 로그 패널이 보여준다
// (service 레이어가 모든 호출을 logStore 에 push).

function toastError(error: unknown): void {
  showToast(error instanceof Error ? `실패: ${error.message}` : '실패: 알 수 없는 오류');
}

/**
 * /me/** 조작 후 캐시 무효화.
 *
 * 필터 없이 전체를 무효화한다 — 수강/전공 변경은 졸업요건·학업요약·학기목록 등 앱 전반의
 * 캐시를 동시에 stale 하게 만들고, 어드민에서 조작한 뒤 곧바로 실제 화면으로 이동해 결과를
 * 확인하는 것이 이 도구의 핵심 사용 흐름이기 때문이다. 어드민 화면에 떠 있는 조회 쿼리도
 * 함께 refetch 되어 수강 목록이 즉시 갱신된다.
 */
function useInvalidateAll() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries();
}

/** 테스트 계정 생성. 성공 시 토큰이 담긴 응답을 그대로 반환한다(세션 전환에 사용). */
export function useCreateTestUserMutation() {
  return useMutation({
    mutationFn: (body: CreateTestUserRequest) => createTestUser(body),
    onSuccess: data => showToast(`테스트 계정 생성 완료 — ${data.studentCode ?? data.email ?? ''}`),
    onError: toastError,
  });
}

/** 강의평가 상태 세팅 5종. 대상은 BE 가 고정한 프론트 테스트 계정(현재 세션 계정 아님). */
export function useSetLectureEvaluationStateMutation() {
  return useMutation({
    mutationFn: (state: LectureEvaluationTestState) => setLectureEvaluationState(state),
    onSuccess: data => showToast(data.message ?? '강의평가 상태 세팅 완료'),
    onError: toastError,
  });
}

/**
 * 현재 계정에 테스트 강의 생성.
 *
 * 응답의 studentCourseId 를 반드시 보관한다 — 삭제에 필요한 row id 를 알려주는 읽기 API 가 없어서
 * (createdCourseStore 주석) 이 순간을 놓치면 그 강의는 개별 삭제가 영영 불가능해지고 계정 초기화밖에
 * 남지 않는다. 응답에 없는 year/semester 는 요청 바디(variables)에서 가져와 채운다.
 */
export function useCreateTestCourseMutation() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: (body: CreateTestCourseRequest) => createTestCourse(body),
    onSuccess: (data, variables) => {
      if (typeof data.studentCourseId === 'number' && data.area !== undefined) {
        addCreatedCourse({
          studentCourseId: data.studentCourseId,
          courseCode: data.courseCode ?? '',
          courseName: data.courseName ?? '(이름 없음)',
          area: data.area,
          year: variables.year ?? null,
          semester: variables.semester ?? null,
        });
      }
      showToast(`강의 생성 완료 — ${data.courseName ?? ''} (studentCourseId: ${data.studentCourseId ?? '?'})`);
      invalidateAll();
    },
    onError: toastError,
  });
}

/** 현재 계정 초기화. 백엔드 수강 데이터가 통째로 사라지므로 생성 이력도 함께 비운다. */
export function useResetAccountMutation() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: () => resetCurrentAccount(),
    onSuccess: data => {
      clearCreatedCourses();
      showToast(data.message ?? '계정 데이터 초기화 완료');
      invalidateAll();
    },
    onError: toastError,
  });
}

/** 현재 계정 전공 상태 수정. */
export function useUpdateMajorMutation() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: (body: UpdateMajorRequest) => updateMajor(body),
    onSuccess: data => {
      showToast(data.message ?? '전공 상태 수정 완료');
      invalidateAll();
    },
    onError: toastError,
  });
}

/**
 * 현재 계정 졸업요건 강의 추가/삭제.
 *
 * 여러 영역을 한 번에 조작해야 하면(예: 서로 다른 영역의 강의를 함께 삭제) 호출부가 영역별로
 * 나눠 순차 호출한다 — 요청 스키마의 area 가 단일 값이라 한 번에 한 영역만 다룰 수 있다.
 */
export function useUpdateGraduationCoursesMutation() {
  const invalidateAll = useInvalidateAll();
  return useMutation({
    mutationFn: (bodies: UpdateGraduationCoursesRequest[]) => runSequentially(bodies),
    onSuccess: (results, bodies) => {
      // 삭제에 성공한 id 는 생성 이력에서도 지운다 — 남겨두면 이미 없는 row 를 다시 지우려 시도하게 된다.
      const removedIds = bodies.flatMap(body => body.removeStudentCourseIds ?? []);
      if (removedIds.length > 0) {
        removeCreatedCourses(removedIds);
      }
      showToast(results[results.length - 1]?.message ?? '졸업요건 강의 수정 완료');
      invalidateAll();
    },
    onError: toastError,
  });
}

// 영역별 PATCH 를 순차 실행한다. 병렬로 쏘면 같은 학생의 수강 row 를 동시에 건드려 백엔드에서
// 경합할 수 있고, 실패 시 어디까지 반영됐는지도 불명확해진다. 하나라도 실패하면 즉시 중단하고
// throw — 이미 성공한 요청은 감사 로그에 남아 있어 어디까지 반영됐는지 확인할 수 있다.
async function runSequentially(bodies: UpdateGraduationCoursesRequest[]) {
  const results = [];
  for (const body of bodies) {
    results.push(await updateGraduationCourses(body));
  }
  return results;
}
