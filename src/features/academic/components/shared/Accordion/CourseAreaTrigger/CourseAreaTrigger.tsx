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
          {requiredElectiveAreas ? (
            <>
              {completedElectiveAreas ?? 0}개 영역 / {requiredElectiveAreas}개 영역
              <span className={styles.areaCount}>
                ({currentCredits}/{requiredCredits})
              </span>
            </>
          ) : (
            <>
              {currentCredits} / {requiredCredits}
            </>
          )}

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
