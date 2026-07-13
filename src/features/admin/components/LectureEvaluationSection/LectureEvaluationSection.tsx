import { Button } from '@/components/ui';
import { useSetLectureEvaluationStateMutation } from '../../apis/queries/useAdminMutations';
import { LECTURE_EVALUATION_STATES } from '../../constants';
import { SectionCard } from '../SectionCard/SectionCard';
import styles from './LectureEvaluationSection.module.scss';

// 대상 계정을 착각하면 "왜 내 화면이 안 바뀌지?" 로 시간을 버리므로 경고를 섹션에 상시 노출한다.
// SectionCard 의 description 은 <p> 안에 렌더되므로 블록 요소가 아닌 span 으로 넘긴다.
const TARGET_ACCOUNT_WARNING = (
  <span className={styles.warning}>
    ⚠ 경고 — 이 API 들의 대상은 현재 세션 계정이 아니라 백엔드가 고정한 프론트 테스트 계정입니다. 지금 로그인한 계정의
    데이터는 바뀌지 않습니다.
  </span>
);

// ② 강의평가 상태 세팅 5종.
export function LectureEvaluationSection() {
  const { mutate, isPending, variables } = useSetLectureEvaluationStateMutation();

  return (
    <SectionCard
      title="② 강의평가 상태 세팅"
      endpoint="POST /api/admin/test-lecture-evaluations/{state}"
      description={TARGET_ACCOUNT_WARNING}
    >
      <div className={styles.grid}>
        {LECTURE_EVALUATION_STATES.map(item => {
          // 실행 중인 버튼만 로딩 표시. 나머지는 중복 호출을 막기 위해 비활성화한다.
          // 뮤테이션 인스턴스가 하나라 동시에 두 개가 pending 일 수 없다.
          const isRunning = isPending && variables === item.state;

          return (
            <Button
              key={item.state}
              type="button"
              variant="secondary"
              // size="sm" 은 대응 CSS 가 없어 의도적으로 "크기 클래스 없음" 으로 쓴다.
              // 지우면 기본값 md 가 붙어 height:64px 가 고정되므로 2줄 라벨과 충돌한다.
              size="sm"
              className={styles.stateButton}
              // isLoading 이 켜지면 Button 이 children 을 Lottie 로 갈아끼워 버튼의 접근 가능한
              // 이름이 사라진다. aria-label 로 이름을 고정하고 aria-busy 로 진행 중임을 알린다.
              aria-label={item.label}
              aria-busy={isRunning}
              isLoading={isRunning}
              disabled={isPending}
              onClick={() => mutate(item.state)}
            >
              <span className={styles.stateLabel}>{item.label}</span>
              <span className={styles.stateDescription}>{item.description}</span>
            </Button>
          );
        })}
      </div>
    </SectionCard>
  );
}
