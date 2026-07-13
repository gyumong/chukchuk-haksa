import { useId, useMemo, useState } from 'react';
import { Button, ConfirmDialog } from '@/components/ui';
import { getSemesterShortLabel } from '@/lib/utils/semester';
import type {
  DepartmentOption,
  SearchCourseOfferingsParams,
  UpdateGraduationCoursesRequest,
} from '@/shared/api/data-contracts';
import { clearCreatedCourses, useCreatedCourses } from '../../apis/createdCourseStore';
import { useUpdateGraduationCoursesMutation } from '../../apis/queries/useAdminMutations';
import { useCourseOfferingsQuery, useGraduationCoursesQuery } from '../../apis/queries/useAdminQueries';
import { GRADE_OPTIONS, GRADUATION_AREAS, SEMESTER_OPTIONS } from '../../constants';
import type { GraduationArea } from '../../types';
import { DepartmentPicker } from '../DepartmentPicker/DepartmentPicker';
import { LabeledCheckbox, NumberField, Select, TextInput } from '../Field';
import type { SelectOption } from '../Field';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './GraduationCoursesSection.module.scss';

const AREA_OPTIONS: SelectOption[] = GRADUATION_AREAS.map(area => ({ value: area, label: area }));
const SEMESTER_SELECT_OPTIONS: SelectOption[] = SEMESTER_OPTIONS.map(({ code, label }) => ({
  value: String(code),
  label,
}));
const GRADE_SELECT_OPTIONS: SelectOption[] = GRADE_OPTIONS.map(grade => ({ value: grade, label: grade }));

interface GraduationCoursesSectionProps {
  hasSession: boolean;
}

const toNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toOptionalString = (value: string): string | undefined => {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
};

const formatYearSemester = (year: number | null | undefined, semester: number | null | undefined): string => {
  const yearText = year === null || year === undefined ? '-' : String(year);
  const semesterText = semester === null || semester === undefined ? '-' : getSemesterShortLabel(semester);
  return `${yearText}-${semesterText}`;
};

/** "2341, 2342 2343" 처럼 쉼표·공백 섞인 입력에서 정수 id 만 뽑는다. */
const parseIdList = (value: string): number[] =>
  value
    .split(/[\s,]+/)
    .map(token => token.trim())
    .filter(token => token !== '')
    .map(Number)
    .filter(id => Number.isInteger(id) && id > 0);

// ③-c 졸업요건 강의 추가/삭제.
// 추가(A)와 삭제(B)는 같은 PATCH 엔드포인트를 쓰지만 뮤테이션 인스턴스를 분리한다 —
// 하나로 쓰면 추가 중일 때 삭제 버튼까지 로딩으로 잠긴다.
export function GraduationCoursesSection({ hasSession }: GraduationCoursesSectionProps) {
  const uid = useId();

  // 블록 A: 검색 폼
  const [keyword, setKeyword] = useState('');
  const [searchArea, setSearchArea] = useState('');
  const [searchYear, setSearchYear] = useState('');
  const [searchSemester, setSearchSemester] = useState('');
  const [searchDepartment, setSearchDepartment] = useState<DepartmentOption | null>(null);

  // 폼 입력이 바뀔 때마다 요청하지 않도록, [강의 검색] 을 누른 시점의 파라미터만 커밋한다.
  const [submittedParams, setSubmittedParams] = useState<SearchCourseOfferingsParams | null>(null);
  const isSearchEnabled = submittedParams !== null;

  const [selectedOfferingIds, setSelectedOfferingIds] = useState<number[]>([]);

  // 블록 A: 일괄 적용 값
  const [applyArea, setApplyArea] = useState('');
  const [applyGrade, setApplyGrade] = useState('');
  const [applyPoints, setApplyPoints] = useState('');
  const [applyIsRetake, setApplyIsRetake] = useState(false);
  const [applyOriginalScore, setApplyOriginalScore] = useState('');

  // 블록 B: 삭제
  const [selectedCreatedIds, setSelectedCreatedIds] = useState<number[]>([]);
  const [manualArea, setManualArea] = useState('');
  const [manualIds, setManualIds] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    data: offeringData,
    isFetching: isSearching,
    error: searchError,
  } = useCourseOfferingsQuery(submittedParams ?? {}, isSearchEnabled);

  const {
    data: progressData,
    isLoading: isProgressLoading,
    isFetching: isProgressFetching,
    error: progressError,
    refetch: refetchProgress,
  } = useGraduationCoursesQuery(hasSession);

  const createdCourses = useCreatedCourses();

  const addMutation = useUpdateGraduationCoursesMutation();
  const removeMutation = useUpdateGraduationCoursesMutation();

  const offerings = useMemo(() => offeringData ?? [], [offeringData]);
  const progressRows = useMemo(() => progressData ?? [], [progressData]);

  const selectableOfferingIds = useMemo(
    () => offerings.map(offering => offering.offeringId).filter((id): id is number => typeof id === 'number'),
    [offerings]
  );

  const parsedManualIds = useMemo(() => parseIdList(manualIds), [manualIds]);

  // 삭제 요청은 영역별로 나눠 보낸다 — 요청 스키마의 area 가 단일 값이라 한 번에 한 영역만 담긴다.
  // 생성 이력에서 고른 것(영역을 이미 안다)과 직접 입력한 id(영역을 사용자가 지정)를 같은 맵에 합친다.
  const deleteBodies = useMemo<UpdateGraduationCoursesRequest[]>(() => {
    const grouped = new Map<GraduationArea, number[]>();

    const push = (area: GraduationArea, id: number) => {
      const ids = grouped.get(area) ?? [];
      if (!ids.includes(id)) {
        ids.push(id);
      }
      grouped.set(area, ids);
    };

    for (const course of createdCourses) {
      if (selectedCreatedIds.includes(course.studentCourseId)) {
        push(course.area, course.studentCourseId);
      }
    }
    if (manualArea !== '') {
      for (const id of parsedManualIds) {
        push(manualArea as GraduationArea, id);
      }
    }

    return Array.from(grouped, ([area, removeStudentCourseIds]) => ({ area, removeStudentCourseIds }));
  }, [createdCourses, selectedCreatedIds, manualArea, parsedManualIds]);

  const deleteTargetCount = deleteBodies.reduce((sum, body) => sum + (body.removeStudentCourseIds?.length ?? 0), 0);

  const handleSearch = () => {
    setSubmittedParams({
      keyword: toOptionalString(keyword),
      area: searchArea === '' ? undefined : (searchArea as GraduationArea),
      year: toNumber(searchYear),
      semester: toNumber(searchSemester),
      departmentId: searchDepartment?.id,
    });
    // 이전 검색 결과에서 고른 선택이 새 결과에 섞이지 않도록 비운다.
    setSelectedOfferingIds([]);
  };

  const toggleOffering = (offeringId: number, checked: boolean) => {
    setSelectedOfferingIds(previous =>
      checked ? [...previous, offeringId] : previous.filter(id => id !== offeringId)
    );
  };

  const toggleAllOfferings = (checked: boolean) => {
    setSelectedOfferingIds(checked ? selectableOfferingIds : []);
  };

  const toggleCreated = (studentCourseId: number, checked: boolean) => {
    setSelectedCreatedIds(previous =>
      checked ? [...previous, studentCourseId] : previous.filter(id => id !== studentCourseId)
    );
  };

  const toggleAllCreated = (checked: boolean) => {
    setSelectedCreatedIds(checked ? createdCourses.map(course => course.studentCourseId) : []);
  };

  const handleAdd = () => {
    if (applyArea === '' || selectedOfferingIds.length === 0) {
      return;
    }
    const body: UpdateGraduationCoursesRequest = {
      area: applyArea as GraduationArea,
      addOfferingIds: selectedOfferingIds,
      grade: toOptionalString(applyGrade),
      points: toNumber(applyPoints),
      isRetake: applyIsRetake,
      originalScore: toNumber(applyOriginalScore),
    };
    // 추가는 단일 영역이므로 요소 1개짜리 배열.
    addMutation.mutate([body], { onSuccess: () => setSelectedOfferingIds([]) });
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    if (deleteBodies.length === 0) {
      return;
    }
    removeMutation.mutate(deleteBodies, {
      onSuccess: () => {
        setSelectedCreatedIds([]);
        setManualIds('');
      },
    });
  };

  const isAllOfferingsSelected =
    selectableOfferingIds.length > 0 && selectableOfferingIds.every(id => selectedOfferingIds.includes(id));
  const isAllCreatedSelected =
    createdCourses.length > 0 && createdCourses.every(course => selectedCreatedIds.includes(course.studentCourseId));

  return (
    <SectionCard
      title="③-c 졸업요건 강의 추가/삭제"
      endpoint="PATCH /api/admin/me/graduation-courses"
      description="개설강의를 검색해 현재 계정의 졸업요건 영역에 붙이거나, 이미 붙은 수강 row 를 떼어낸다."
      disabledReason={
        hasSession ? undefined : '세션이 없습니다. ①에서 테스트 계정을 만들고 [이 계정으로 전환]을 누르세요.'
      }
    >
      <div className={styles.block}>
        <h3 className={styles.blockTitle}>A. 강의 추가 (개설강의 검색 → 선택 → 일괄 추가)</h3>

        <div className={styles.grid}>
          <TextInput
            id={`${uid}-keyword`}
            label="키워드"
            value={keyword}
            onChange={setKeyword}
            placeholder="과목명 또는 학수번호"
          />
          <Select
            id={`${uid}-search-area`}
            label="영역"
            value={searchArea}
            onChange={setSearchArea}
            options={AREA_OPTIONS}
            placeholder="전체"
          />
          <NumberField
            id={`${uid}-search-year`}
            label="연도"
            value={searchYear}
            onChange={setSearchYear}
            placeholder="2024"
          />
          <Select
            id={`${uid}-search-semester`}
            label="학기"
            value={searchSemester}
            onChange={setSearchSemester}
            options={SEMESTER_SELECT_OPTIONS}
            placeholder="전체"
          />
          <DepartmentPicker label="개설학과" value={searchDepartment} onChange={setSearchDepartment} />
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={handleSearch} isLoading={isSearching}>
            강의 검색
          </Button>
        </div>

        {searchError && (
          <p className={styles.error}>
            검색 실패: {searchError instanceof Error ? searchError.message : '알 수 없는 오류'}
            <br />
            결과가 많은 검색은 dev 백엔드가 500 을 냅니다(알려진 이슈 — 키워드 없이 연도·학기만 지정하면 항상 실패).
            키워드나 개설학과를 함께 지정해 좁혀 보세요.
          </p>
        )}

        {!isSearchEnabled && <p className={styles.status}>검색 조건을 넣고 [강의 검색] 을 누르세요.</p>}
        {isSearchEnabled && isSearching && <p className={styles.status}>검색 중…</p>}
        {isSearchEnabled && !isSearching && !searchError && offerings.length === 0 && (
          <p className={styles.status}>검색 결과가 없습니다.</p>
        )}

        {offerings.length > 0 && (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        aria-label="검색 결과 전체 선택"
                        checked={isAllOfferingsSelected}
                        disabled={selectableOfferingIds.length === 0}
                        onChange={event => toggleAllOfferings(event.target.checked)}
                      />
                    </th>
                    <th>offeringId</th>
                    <th>학수번호</th>
                    <th>과목명</th>
                    <th>영역</th>
                    <th>연도-학기</th>
                    <th>학점</th>
                    <th>개설학과</th>
                  </tr>
                </thead>
                <tbody>
                  {offerings.map((offering, index) => {
                    const offeringId = offering.offeringId;
                    const isSelectable = typeof offeringId === 'number';
                    return (
                      <tr key={offeringId ?? `${offering.courseCode ?? 'unknown'}-${index}`}>
                        <td className={styles.checkboxCell}>
                          <input
                            type="checkbox"
                            className={styles.checkbox}
                            aria-label={`${offering.courseName ?? '강의'} 선택`}
                            checked={isSelectable && selectedOfferingIds.includes(offeringId)}
                            disabled={!isSelectable}
                            onChange={event => {
                              if (isSelectable) {
                                toggleOffering(offeringId, event.target.checked);
                              }
                            }}
                          />
                        </td>
                        <td>{offeringId ?? <span className={styles.muted}>없음</span>}</td>
                        <td>{offering.courseCode ?? '-'}</td>
                        <td>{offering.courseName ?? '-'}</td>
                        <td>{offering.area ?? <span className={styles.muted}>{offering.rawArea ?? '-'}</span>}</td>
                        <td>{formatYearSemester(offering.year, offering.semester)}</td>
                        <td>{offering.credits ?? '-'}</td>
                        <td>{offering.departmentName ?? '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className={styles.summary}>
              {offerings.length}건 중 {selectedOfferingIds.length}건 선택
            </p>
          </>
        )}

        <p className={styles.warning}>
          ⚠ 성적 · 학점 · 재수강 · 원점수는 선택한 <strong>모든</strong> 강의에 동일하게 적용된다. 과목마다 성적을
          다르게 하려면 한 번에 하나씩 추가할 것. 이 경로로 추가한 강의는 응답에 row id 가 없어 나중에 개별 삭제할 수
          없다(삭제까지 하려면 ③-b 로 만들 것).
        </p>

        <div className={styles.grid}>
          <Select
            id={`${uid}-apply-area`}
            label="영역 (필수)"
            value={applyArea}
            onChange={setApplyArea}
            options={AREA_OPTIONS}
            placeholder="선택하세요"
          />
          <Select
            id={`${uid}-apply-grade`}
            label="성적"
            value={applyGrade}
            onChange={setApplyGrade}
            options={GRADE_SELECT_OPTIONS}
            placeholder="미지정"
          />
          <NumberField
            id={`${uid}-apply-points`}
            label="학점"
            value={applyPoints}
            onChange={setApplyPoints}
            placeholder="3"
          />
          <NumberField
            id={`${uid}-apply-original-score`}
            label="원점수"
            value={applyOriginalScore}
            onChange={setApplyOriginalScore}
            placeholder="95"
          />
          <LabeledCheckbox label="재수강" checked={applyIsRetake} onChange={setApplyIsRetake} />
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            onClick={handleAdd}
            disabled={applyArea === '' || selectedOfferingIds.length === 0 || addMutation.isPending}
            isLoading={addMutation.isPending}
          >
            선택한 {selectedOfferingIds.length}개 강의 추가
          </Button>
          {applyArea === '' && <span className={styles.status}>영역을 먼저 선택하세요.</span>}
        </div>
      </div>

      <div className={styles.block}>
        <h3 className={styles.blockTitle}>B. 현재 수강 현황 (조회 전용)</h3>

        <p className={styles.warning}>
          ⚠ 이 표에는 삭제용 id 가 없다. 백엔드에 student_course row id 를 알려주는 읽기 API 가 하나도 없기 때문이다 —
          졸업요건 진척 응답의 강의에는 id 필드 자체가 없고, 학기 목록·학기별 성적 상세는 테스트 계정에서 늘
          실패한다(신입생·성적 없음). 그래서 삭제는 아래 C 처럼 <strong>생성 시 받은 id</strong> 로만 한다.
        </p>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => refetchProgress()}
            isLoading={isProgressFetching}
          >
            현황 새로고침
          </Button>
        </div>

        {progressError && (
          <p className={styles.error}>
            수강 현황 조회 실패: {progressError instanceof Error ? progressError.message : '알 수 없는 오류'}
          </p>
        )}

        {isProgressLoading && <p className={styles.status}>불러오는 중…</p>}
        {!isProgressLoading && !progressError && progressRows.length === 0 && (
          <p className={styles.status}>
            수강 중인 강의가 없습니다. (졸업요건 기준이 없는 학과·입학년도면 강의를 넣어도 여기 안 보인다 — 그 자체가
            &apos;졸업요건 데이터 부재&apos; 문의의 재현이다.)
          </p>
        )}

        {progressRows.length > 0 && (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>영역</th>
                  <th>과목명</th>
                  <th>연도-학기</th>
                  <th>학점</th>
                  <th>성적</th>
                </tr>
              </thead>
              <tbody>
                {progressRows.map((row, index) => (
                  <tr key={`${row.area}-${row.courseName}-${index}`}>
                    <td>{row.area}</td>
                    <td>{row.courseName}</td>
                    <td>{formatYearSemester(row.year, row.semester)}</td>
                    <td>{row.credits ?? '-'}</td>
                    <td>{row.grade || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className={styles.block}>
        <h3 className={styles.blockTitle}>C. 강의 삭제 (생성 시 받은 id 로만 가능)</h3>

        <p className={styles.status}>
          ③-b 로 만든 강의는 응답의 studentCourseId 를 이 브라우저에 보관해 두었다가 여기서 삭제할 수 있다. 목록에 없는
          강의는 ③-d 계정 초기화로만 지울 수 있다.
        </p>

        {createdCourses.length === 0 ? (
          <p className={styles.status}>이 브라우저에서 ③-b 로 만든 강의가 없습니다.</p>
        ) : (
          <>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.checkboxCell}>
                      <input
                        type="checkbox"
                        className={styles.checkbox}
                        aria-label="생성 이력 전체 선택"
                        checked={isAllCreatedSelected}
                        onChange={event => toggleAllCreated(event.target.checked)}
                      />
                    </th>
                    <th>studentCourseId</th>
                    <th>영역</th>
                    <th>학수번호</th>
                    <th>과목명</th>
                    <th>연도-학기</th>
                  </tr>
                </thead>
                <tbody>
                  {createdCourses.map(course => (
                    <tr key={course.studentCourseId}>
                      <td className={styles.checkboxCell}>
                        <input
                          type="checkbox"
                          className={styles.checkbox}
                          aria-label={`${course.courseName} 선택`}
                          checked={selectedCreatedIds.includes(course.studentCourseId)}
                          onChange={event => toggleCreated(course.studentCourseId, event.target.checked)}
                        />
                      </td>
                      <td>{course.studentCourseId}</td>
                      <td>{course.area}</td>
                      <td>{course.courseCode || '-'}</td>
                      <td>{course.courseName}</td>
                      <td>{formatYearSemester(course.year, course.semester)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={styles.actions}>
              <Button type="button" variant="secondary" size="sm" onClick={clearCreatedCourses}>
                생성 이력 비우기 (백엔드는 안 지움)
              </Button>
            </div>
          </>
        )}

        <div className={styles.grid}>
          <Select
            id={`${uid}-manual-area`}
            label="직접 삭제 — 영역"
            value={manualArea}
            onChange={setManualArea}
            options={AREA_OPTIONS}
            placeholder="선택"
          />
          <TextInput
            id={`${uid}-manual-ids`}
            label="직접 삭제 — studentCourseId (쉼표 구분)"
            value={manualIds}
            onChange={setManualIds}
            placeholder="2341, 2342"
          />
        </div>
        {manualIds.trim() !== '' && manualArea === '' && (
          <p className={styles.status}>직접 삭제하려면 영역도 함께 선택해야 합니다.</p>
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="error"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={deleteTargetCount === 0 || removeMutation.isPending}
            isLoading={removeMutation.isPending}
          >
            선택한 {deleteTargetCount}개 강의 삭제
          </Button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="졸업요건 강의 삭제"
        message={`선택한 ${deleteTargetCount}개 강의를 삭제합니다.\n영역 ${deleteBodies.length}건으로 나눠 순차 PATCH 하며, 되돌릴 수 없습니다.`}
        confirmText="삭제"
        onConfirm={handleDelete}
        onClose={() => setIsDeleteDialogOpen(false)}
      />
    </SectionCard>
  );
}
