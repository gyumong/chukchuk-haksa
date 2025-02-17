import { useState } from 'react';
import { CourseAreaTrigger, CourseList } from '..';
import type { CourseAreaProps } from '../types';
import styles from './CourseAccordion.module.scss';

export default function CourseAccordion({
  title,
  currentCredits,
  requiredCredits,
  isCompleted,
  courses = [],
}: CourseAreaProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${styles.container} ${isCompleted ? styles.completed : ''}`}>
      <CourseAreaTrigger
        title={title}
        currentCredits={currentCredits}
        requiredCredits={requiredCredits}
        isCompleted={isCompleted}
        isExpanded={isExpanded}
        onClick={() => setIsExpanded(!isExpanded)}
      />
      {courses.length > 0 && (
        <div className={`${styles.content} ${isExpanded ? styles.expanded : ''}`}>
          <div className={styles.inner}>
            <div className={styles.list}>
              <CourseList courses={courses} isCompleted={isCompleted} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
