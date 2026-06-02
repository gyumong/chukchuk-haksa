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
  onClick,
}: CourseAreaTriggerProps) {
  // TODO 선교 의존성 들어내기
  return (
    <div className={`${styles.container} ${isCompleted ? styles.completed : ''}`} onClick={onClick}>
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.credits}>
          {currentCredits} / {requiredCredits}
          {requiredElectiveAreas ? (
            <span className={styles.areaCount}>
              {completedElectiveAreas ?? 0}개영역 / {requiredElectiveAreas}개영역
            </span>
          ) : null}

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
