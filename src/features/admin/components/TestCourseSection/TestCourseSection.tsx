import { useId, useState } from 'react';
import { Button, ConfirmDialog } from '@/components/ui';
import type { CreateTestCourseRequest, DepartmentOption } from '@/shared/api/data-contracts';
import { useCreateTestCourseMutation, useResetAccountMutation } from '../../apis/queries/useAdminMutations';
import { GRADE_OPTIONS, GRADUATION_AREAS, SEMESTER_OPTIONS } from '../../constants';
import type { GraduationArea } from '../../types';
import { DepartmentPicker } from '../DepartmentPicker/DepartmentPicker';
import { LabeledCheckbox, NumberField, Select, TextInput } from '../Field';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './TestCourseSection.module.scss';

interface TestCourseSectionProps {
  hasSession: boolean;
}

const NO_SESSION_REASON = '세션이 없습니다. ①에서 테스트 계정을 만들고 [이 계정으로 전환]을 누르세요.';

const AREA_OPTIONS = GRADUATION_AREAS.map(area => ({ value: area, label: area }));
const SEMESTER_SELECT_OPTIONS = SEMESTER_OPTIONS.map(({ code, label }) => ({ value: String(code), label }));
const GRADE_SELECT_OPTIONS = GRADE_OPTIONS.map(grade => ({ value: grade, label: grade }));

// 빈 문자열은 "미입력"이므로 요청 바디에서 필드 자체를 뺀다. 0 과 미입력을 구분하기 위함.
const toNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toText = (value: string): string | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') {
    return undefined;
  }
  return trimmed;
};

// ③-b 테스트 강의 생성 + ③-d 계정 초기화. 둘 다 "현재 세션 계정"을 대상으로 하는 /me/** 조작이라
// 세션 가드 조건이 같아 한 파일에 묶는다.
export function TestCourseSection({ hasSession }: TestCourseSectionProps) {
  const fieldId = useId();

  const [courseCode, setCourseCode] = useState('');
  const [courseName, setCourseName] = useState('');
  const [area, setArea] = useState('');
  const [department, setDepartment] = useState<DepartmentOption | null>(null);
  const [hostDepartment, setHostDepartment] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [credits, setCredits] = useState('');
  const [grade, setGrade] = useState('');
  const [isRetake, setIsRetake] = useState(false);
  const [originalScore, setOriginalScore] = useState('');
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const createCourseMutation = useCreateTestCourseMutation();
  const resetMutation = useResetAccountMutation();

  const handleCreateCourse = () => {
    const body: CreateTestCourseRequest = {
      courseCode: toText(courseCode),
      courseName: toText(courseName),
      area: area === '' ? undefined : (area as GraduationArea),
      departmentId: department?.id,
      hostDepartment: toText(hostDepartment),
      year: toNumber(year),
      semester: toNumber(semester),
      credits: toNumber(credits),
      grade: toText(grade),
      isRetake,
      originalScore: toNumber(originalScore),
    };

    createCourseMutation.mutate(body);
  };

  const handleConfirmReset = () => {
    resetMutation.mutate();
    setIsResetDialogOpen(false);
  };

  const disabledReason = hasSession ? undefined : NO_SESSION_REASON;

  return (
    <>
      <SectionCard
        title="③-b 테스트 강의 생성"
        endpoint="POST /api/admin/me/test-courses"
        description="개설강의를 새로 만들어 현재 계정의 수강 데이터에 바로 꽂는다. 졸업요건 데이터 부재 문의를 재현할 때 가장 빠른 경로."
        disabledReason={disabledReason}
      >
        <div className={styles.grid}>
          <div className={styles.cell}>
            <TextInput
              id={`${fieldId}-course-code`}
              label="학수번호"
              value={courseCode}
              onChange={setCourseCode}
              placeholder="test_ 없이 입력해도 됨"
              aria-describedby={`${fieldId}-course-code-help`}
              disabled={!hasSession}
            />
            <p id={`${fieldId}-course-code-help`} className={styles.helper}>
              test_ prefix 가 없으면 백엔드가 자동으로 붙인다.
            </p>
          </div>

          <div className={styles.cell}>
            <TextInput
              id={`${fieldId}-course-name`}
              label="과목명"
              value={courseName}
              onChange={setCourseName}
              disabled={!hasSession}
            />
          </div>

          <div className={styles.cell}>
            <Select
              id={`${fieldId}-area`}
              label="영역"
              value={area}
              onChange={setArea}
              options={AREA_OPTIONS}
              placeholder="선택"
              disabled={!hasSession}
            />
          </div>

          <div className={styles.cell}>
            <DepartmentPicker label="개설 학과" value={department} onChange={setDepartment} disabled={!hasSession} />
          </div>

          <div className={styles.cell}>
            <TextInput
              id={`${fieldId}-host-department`}
              label="개설 학과명"
              value={hostDepartment}
              onChange={setHostDepartment}
              aria-describedby={`${fieldId}-host-department-help`}
              disabled={!hasSession}
            />
            <p id={`${fieldId}-host-department-help`} className={styles.helper}>
              개설 학과를 검색으로 못 고를 때 쓰는 폴백.
            </p>
          </div>

          <div className={styles.cell}>
            <NumberField
              id={`${fieldId}-year`}
              label="이수 연도"
              value={year}
              onChange={setYear}
              placeholder="2024"
              disabled={!hasSession}
            />
          </div>

          <div className={styles.cell}>
            <Select
              id={`${fieldId}-semester`}
              label="학기"
              value={semester}
              onChange={setSemester}
              options={SEMESTER_SELECT_OPTIONS}
              placeholder="선택"
              aria-describedby={`${fieldId}-semester-help`}
              disabled={!hasSession}
            />
            <p id={`${fieldId}-semester-help`} className={styles.helper}>
              1/2 가 아니라 학기 코드(10 · 15 · 20 · 25)로 전송된다.
            </p>
          </div>

          <div className={styles.cell}>
            <NumberField
              id={`${fieldId}-credits`}
              label="학점"
              value={credits}
              onChange={setCredits}
              placeholder="3"
              disabled={!hasSession}
            />
          </div>

          <div className={styles.cell}>
            <Select
              id={`${fieldId}-grade`}
              label="성적"
              value={grade}
              onChange={setGrade}
              options={GRADE_SELECT_OPTIONS}
              placeholder="선택"
              disabled={!hasSession}
            />
          </div>

          <div className={styles.cell}>
            <NumberField
              id={`${fieldId}-original-score`}
              label="원점수"
              value={originalScore}
              onChange={setOriginalScore}
              placeholder="95"
              disabled={!hasSession}
            />
          </div>

          <div className={styles.checkboxCell}>
            <LabeledCheckbox label="재수강" checked={isRetake} onChange={setIsRetake} disabled={!hasSession} />
          </div>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            size="sm"
            onClick={handleCreateCourse}
            isLoading={createCourseMutation.isPending}
            disabled={!hasSession || createCourseMutation.isPending}
          >
            강의 생성
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="③-d 계정 데이터 초기화"
        endpoint="POST /api/admin/me/reset"
        description="현재 계정의 수강 데이터와 전공 상태를 초기 상태로 되돌린다. 되돌릴 수 없다."
        disabledReason={disabledReason}
      >
        <div className={styles.actions}>
          <Button
            type="button"
            variant="error"
            size="sm"
            onClick={() => setIsResetDialogOpen(true)}
            isLoading={resetMutation.isPending}
            disabled={!hasSession || resetMutation.isPending}
          >
            계정 데이터 초기화
          </Button>
        </div>
      </SectionCard>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        title="계정 데이터 초기화"
        message={'현재 로그인된 계정의 수강 데이터와 전공 상태가 모두 초기화됩니다.\n되돌릴 수 없습니다. 진행할까요?'}
        confirmText="초기화"
        onConfirm={handleConfirmReset}
        onClose={() => setIsResetDialogOpen(false)}
      />
    </>
  );
}
