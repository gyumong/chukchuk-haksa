'use client';

import { useGraduationProgressQuery } from '../../apis/queries/useGraduationProgressQuery';
import { useAreaProgress } from '../../hooks/useAcademicProgress';
import { CourseAccordion } from '../shared/Accordion';
import styles from './AreaProgressSection.module.scss';

export default function AreaProgressSection() {
  const { data: graduationProgress } = useGraduationProgressQuery();
  const { progressWithDisplayInfo } = useAreaProgress(graduationProgress);

  return (
    <>
      {progressWithDisplayInfo.map((area, index) => (
        <div key={area.areaType}>
          <CourseAccordion
            title={area.displayName}
            currentCredits={area.earnedCredits}
            requiredCredits={area.requiredCredits}
            requiredElectiveCredits={area.requiredElectiveCourses}
            isCompleted={area.isCompleted}
            courses={area.courses}
          />
          {index < progressWithDisplayInfo.length - 1 && (
            <div className={styles.spacing}></div>
          )}
        </div>
      ))}
    </>
  );
}
