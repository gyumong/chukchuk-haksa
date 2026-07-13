import { useState } from 'react';
import { Button } from '@/components/ui';
import type { DepartmentOption, UpdateMajorRequest } from '@/shared/api/data-contracts';
import { useUpdateMajorMutation } from '../../apis/queries/useAdminMutations';
import { DepartmentPicker } from '../DepartmentPicker/DepartmentPicker';
import { LabeledCheckbox } from '../Field';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './MajorSection.module.scss';

interface MajorSectionProps {
  hasSession: boolean;
}

// 현재 세션 계정의 전공 상태 수정. 계정 생성(①)과 달리 대상이 "지금 로그인된 계정"이라
// 세션이 없으면 조작 자체가 무의미하다 → SectionCard 가 통째로 흐려진다.
export function MajorSection({ hasSession }: MajorSectionProps) {
  const [majorDepartment, setMajorDepartment] = useState<DepartmentOption | null>(null);
  const [dualMajorEnabled, setDualMajorEnabled] = useState(false);
  const [secondaryDepartment, setSecondaryDepartment] = useState<DepartmentOption | null>(null);

  const { mutate, isPending } = useUpdateMajorMutation();

  // 복수전공을 끄면 이전에 고른 학과를 남겨두지 않는다 — 숨겨진 값이 다음 요청에 섞이는 것을 막는다.
  const handleDualMajorChange = (checked: boolean) => {
    setDualMajorEnabled(checked);
    if (!checked) {
      setSecondaryDepartment(null);
    }
  };

  const handleSubmit = () => {
    const body: UpdateMajorRequest = { dualMajorEnabled };

    if (majorDepartment?.id !== undefined) {
      body.majorDepartmentId = majorDepartment.id;
    }

    // dualMajorEnabled 가 false 면 복수전공 학과는 보내지 않는다(서로 모순되는 바디 방지).
    if (dualMajorEnabled && secondaryDepartment?.id !== undefined) {
      body.secondaryMajorDepartmentId = secondaryDepartment.id;
    }

    mutate(body);
  };

  return (
    <SectionCard
      title="③-a 전공 상태 수정"
      endpoint="PATCH /api/admin/me/major"
      description="대상은 현재 로그인된(세션) 계정입니다."
      disabledReason={
        hasSession ? undefined : '세션이 없습니다. ①에서 테스트 계정을 만들고 [이 계정으로 전환]을 누르세요.'
      }
    >
      <div className={styles.form}>
        <DepartmentPicker
          label="주전공 학과"
          value={majorDepartment}
          onChange={setMajorDepartment}
          disabled={!hasSession}
        />

        <LabeledCheckbox
          label="복수전공 사용"
          checked={dualMajorEnabled}
          onChange={handleDualMajorChange}
          disabled={!hasSession}
        />

        {dualMajorEnabled && (
          <DepartmentPicker
            label="복수전공 학과"
            value={secondaryDepartment}
            onChange={setSecondaryDepartment}
            disabled={!hasSession}
          />
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            size="sm"
            isLoading={isPending}
            disabled={!hasSession || isPending}
            onClick={handleSubmit}
          >
            전공 상태 적용
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}
