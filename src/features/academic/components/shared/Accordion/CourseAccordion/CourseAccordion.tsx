import { useState } from 'react';
import { CourseAreaTrigger, CourseList } from '..';
import type { CourseAreaProps } from '../types';
import styles from './CourseAccordion.module.scss';

export default function CourseAccordion({
  title,
  currentCredits,
  requiredCredits,
  requiredElectiveAreas,
  completedElectiveAreas,
  isCompleted,
  courses = [],
  trailingAdornment,
  creditsLabel,
  children,
}: CourseAreaProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // children 이 있으면 그것이 본문(과목 리스트 대체), 없으면 과목이 있을 때만 펼침 영역을 만든다.
  const hasContent = children != null || courses.length > 0;

  return (
    <div className={`${styles.container} ${isCompleted ? styles.completed : ''}`}>
      <CourseAreaTrigger
        title={title}
        currentCredits={currentCredits}
        requiredCredits={requiredCredits}
        isCompleted={isCompleted}
        isExpanded={isExpanded}
        requiredElectiveAreas={requiredElectiveAreas}
        completedElectiveAreas={completedElectiveAreas}
        trailingAdornment={trailingAdornment}
        creditsLabel={creditsLabel}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {hasContent && (
        <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
          <div className={styles.inner}>
            <div className={styles.list}>{children ?? <CourseList courses={courses} isCompleted={isCompleted} />}</div>
          </div>
        </div>
      )}
    </div>
  );
}
