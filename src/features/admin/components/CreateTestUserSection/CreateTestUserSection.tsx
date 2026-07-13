import { useId, useState } from 'react';
import { Button, showToast } from '@/components/ui';
import type { CreateTestUserRequest, DepartmentOption, TestUserResponse } from '@/shared/api/data-contracts';
import { useCreateTestUserMutation } from '../../apis/queries/useAdminMutations';
import { useSessionSwitch } from '../../hooks/useSessionSwitch';
import { DepartmentPicker } from '../DepartmentPicker/DepartmentPicker';
import { LabeledCheckbox, NumberField, TextInput } from '../Field';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './CreateTestUserSection.module.scss';

// 토큰 전체는 화면 캡처·공유 시 그대로 새어나가므로 앞부분만 보여주고 복사는 클립보드로만 한다.
const TOKEN_PREVIEW_LENGTH = 24;

// 빈 문자열은 "미입력"이라 요청 바디에서 필드를 통째로 생략한다(0 과 구분).
const toNumber = (value: string): number | undefined => {
  const trimmed = value.trim();
  if (trimmed === '') {
    return undefined;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const toTokenPreview = (token: string): string =>
  token.length > TOKEN_PREVIEW_LENGTH ? `${token.slice(0, TOKEN_PREVIEW_LENGTH)}…` : token;

// 무인증 API 라 세션 없이도 동작한다 — 로그인 전 상태에서 문의자와 같은 조건의 계정을 만들고
// 곧바로 그 계정으로 사이트를 돌려보는 것이 이 섹션의 목적이다.
export function CreateTestUserSection() {
  const nameId = useId();
  const admissionYearId = useId();

  const [name, setName] = useState('프론트테스트');
  const [department, setDepartment] = useState<DepartmentOption | null>(null);
  const [isMajorSameAsDepartment, setIsMajorSameAsDepartment] = useState(true);
  const [major, setMajor] = useState<DepartmentOption | null>(null);
  const [secondaryMajor, setSecondaryMajor] = useState<DepartmentOption | null>(null);
  const [admissionYear, setAdmissionYear] = useState('');
  const [isPortalLinked, setIsPortalLinked] = useState(true);
  const [createdUser, setCreatedUser] = useState<TestUserResponse | null>(null);

  const { mutate: createTestUser, isPending } = useCreateTestUserMutation();
  const { switchSession, isSwitching } = useSessionSwitch();

  const accessToken = createdUser?.accessToken;
  const refreshToken = createdUser?.refreshToken;
  const canSwitchSession = accessToken !== undefined && refreshToken !== undefined;

  const resultRows: Array<{ label: string; value: string }> =
    createdUser === null
      ? []
      : [
          { label: 'email', value: createdUser.email ?? '—' },
          { label: 'studentCode', value: createdUser.studentCode ?? '—' },
          { label: 'userId', value: createdUser.userId ?? '—' },
          { label: 'studentId', value: createdUser.studentId ?? '—' },
        ];

  const tokenRows: Array<{ label: string; token: string | undefined }> = [
    { label: 'accessToken', token: accessToken },
    { label: 'refreshToken', token: refreshToken },
  ];

  const handleCreate = () => {
    const trimmedName = name.trim();
    // 주전공을 따로 고르지 않으면 majorId 가 빈 계정이 만들어져 전공 화면이 비어 보인다 → 학과 id 로 채운다.
    const majorDepartment = isMajorSameAsDepartment ? department : major;

    const body: CreateTestUserRequest = {
      name: trimmedName === '' ? undefined : trimmedName,
      departmentId: department?.id,
      majorId: majorDepartment?.id,
      secondaryMajorDepartmentId: secondaryMajor?.id,
      admissionYear: toNumber(admissionYear),
      isPortalLinked,
    };

    createTestUser(body, { onSuccess: data => setCreatedUser(data) });
  };

  // 클립보드는 비보안 컨텍스트(http)에서 아예 없을 수 있다. 실패해도 던지지 않고 토스트로만 알린다.
  const handleCopyToken = async (label: string, token: string | undefined): Promise<void> => {
    if (token === undefined) {
      return;
    }

    const clipboard: Clipboard | undefined = navigator.clipboard;
    if (clipboard === undefined) {
      showToast(`${label} 복사 실패 — 이 브라우저에서는 클립보드를 사용할 수 없습니다`);
      return;
    }

    try {
      await clipboard.writeText(token);
      showToast(`${label} 복사됨`);
    } catch {
      showToast(`${label} 복사 실패 — 값을 직접 선택해 복사해 주세요`);
    }
  };

  const handleSwitchSession = () => {
    if (accessToken === undefined || refreshToken === undefined) {
      return;
    }
    void switchSession({ accessToken, refreshToken });
  };

  return (
    <SectionCard
      title="① 테스트 계정 생성"
      endpoint="POST /api/admin/test-users"
      description={
        '문의자와 같은 학과·입학년도로 계정을 만든 뒤 [이 계정으로 전환]을 누르면 dev 사이트 전체가 그 계정으로 동작한다.\n세션이 없어도 호출되는 무인증 API 라 로그인 전에도 쓸 수 있다.'
      }
    >
      <div className={styles.form}>
        <TextInput id={nameId} label="이름 (name)" value={name} onChange={setName} placeholder="프론트테스트" />
        <NumberField
          id={admissionYearId}
          label="입학년도 (admissionYear)"
          value={admissionYear}
          onChange={setAdmissionYear}
          placeholder="2024"
        />
      </div>

      <div className={styles.pickers}>
        <DepartmentPicker label="학과 (departmentId)" value={department} onChange={setDepartment} />
        {!isMajorSameAsDepartment && <DepartmentPicker label="주전공 (majorId)" value={major} onChange={setMajor} />}
        <DepartmentPicker
          label="복수전공 (secondaryMajorDepartmentId)"
          value={secondaryMajor}
          onChange={setSecondaryMajor}
        />
      </div>

      <div className={styles.options}>
        <LabeledCheckbox
          label="주전공을 학과와 동일하게"
          checked={isMajorSameAsDepartment}
          onChange={setIsMajorSameAsDepartment}
        />
        <LabeledCheckbox label="포털 연동 (isPortalLinked)" checked={isPortalLinked} onChange={setIsPortalLinked} />
        <p className={styles.helper}>포털 연동을 해제하면 미연동 계정 — 로그인 직후 온보딩 퍼널 상태를 재현한다.</p>
      </div>

      <div className={styles.actions}>
        <Button type="button" onClick={handleCreate} isLoading={isPending} disabled={isPending}>
          계정 생성
        </Button>
      </div>

      {createdUser !== null && (
        <div className={styles.result}>
          <h3 className={styles.resultTitle}>생성된 계정 (최신 1건 · 이력은 로그 패널)</h3>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <tbody>
                {resultRows.map(row => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className={styles.tokenList}>
            {tokenRows.map(({ label, token }) => (
              <li key={label} className={styles.tokenRow}>
                <span className={styles.tokenLabel}>{label}</span>
                <code className={styles.tokenValue}>{token === undefined ? '응답에 없음' : toTokenPreview(token)}</code>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={token === undefined}
                  onClick={() => void handleCopyToken(label, token)}
                >
                  복사
                </Button>
              </li>
            ))}
          </ul>

          <div className={styles.switchRow}>
            <Button
              type="button"
              variant="primary"
              onClick={handleSwitchSession}
              isLoading={isSwitching}
              disabled={!canSwitchSession || isSwitching}
            >
              이 계정으로 전환
            </Button>
            {!canSwitchSession && (
              <p className={styles.warning}>응답에 토큰이 없어 전환할 수 없습니다. 로그 패널에서 응답을 확인하세요.</p>
            )}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
