import { Icon } from '@/components/ui';
import type { CourseAreaTriggerProps } from '../types';
import styles from './CourseAreaTrigger.module.scss';

export default function CourseAreaTrigger({
  title,
  currentCredits,
  requiredCredits,
  isCompleted,
  isExpanded,
  requiredElectiveAreas,
  completedElectiveAreas,
  trailingAdornment,
  creditsLabel,
  onClick,
}: CourseAreaTriggerProps) {
  // TODO 선교 의존성 들어내기
  // 학점 표기 우선순위: creditsLabel(통째 대체) > 선교(영역 수) > 기준 없음(숫자만) > "이수 / 기준".
  const renderCredits = () => {
    if (creditsLabel != null) {
      return creditsLabel;
    }
    if (requiredElectiveAreas) {
      return (
        <>
          {completedElectiveAreas ?? 0}개 영역 / {requiredElectiveAreas}개 영역
          <span className={styles.areaCount}>
            ({currentCredits}/{requiredCredits})
          </span>
        </>
      );
    }
    if (requiredCredits == null) {
      return <>{currentCredits}</>;
    }
    return (
      <>
        {currentCredits} / {requiredCredits}
      </>
    );
  };

  return (
    <div className={`${styles.container} ${isCompleted ? styles.completed : ''}`} onClick={onClick}>
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.credits}>
          {renderCredits()}

          {isCompleted && <Icon name="check-status-on" className={styles.checkIcon} size={18} />}
        </span>
        {trailingAdornment}
      </div>
      <Icon
        name="arrow-down"
        className={`${styles.arrow} ${isExpanded ? styles.expanded : ''} ${isCompleted ? styles.completed : ''}`}
      />
    </div>
  );
}
