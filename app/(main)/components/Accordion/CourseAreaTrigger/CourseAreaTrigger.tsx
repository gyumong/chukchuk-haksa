import styles from './CourseAreaTrigger.module.scss';
import type { CourseAreaTriggerProps } from '../types';
import { Icon } from '@/components/ui';

export default function CourseAreaTrigger({
  title,
  currentCredits,
  requiredCredits,
  isCompleted,
  isExpanded,
  onClick,
}: CourseAreaTriggerProps) {
  return (  
    <div 
      className={`${styles.container} ${isCompleted ? styles.completed : ''}`}
      onClick={onClick}
    >
      <div className={styles.info}>
        <span className={styles.title}>{title}</span>
        <span className={styles.credits}>
          {currentCredits} / {requiredCredits}
          {isCompleted &&             
          <Icon 
              name="check-status-on" 
              className={styles.checkIcon} 
              size={18}
            />}
        </span>
      </div>
      <Icon 
        name="arrow-down"
        className={`${styles.arrow} ${isExpanded ? styles.expanded : ''} ${isCompleted ? styles.completed : ''}`}
      />
    </div>
  );
}