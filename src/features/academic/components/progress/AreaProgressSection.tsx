'use client';

import { useGraduationProgressQuery } from '../../apis/queries/useGraduationProgressQuery';
import { useAreaProgress } from '../../hooks/useAcademicProgress';
import { CourseAccordion } from '../shared/Accordion';
import styles from './AreaProgressSection.module.scss';

export default function AreaProgressSection() {
  const { data: graduationProgress } = useGraduationProgressQuery();
  const { mainMajorAreas, dualMajorAreas } = useAreaProgress(graduationProgress);

  return (
    <>
      {/* 일반전공 영역들 */}
      {mainMajorAreas.map((area, index) => (
        <div key={area.areaType}>
          <CourseAccordion
            title={area.displayName}
            currentCredits={area.earnedCredits}
            requiredCredits={area.requiredCredits}
            requiredElectiveCredits={area.requiredElectiveCourses}
            isCompleted={area.isCompleted}
            courses={area.courses}
          />
          {(index < mainMajorAreas.length - 1 || dualMajorAreas.length > 0) && (
            <div className={styles.spacing}></div>
          )}
        </div>
      ))}

      {/* 복수전공 섹션 */}
      {dualMajorAreas.length > 0 && (
        <>
          <div className={styles.dualMajorHeader}>
            <div className={styles.dualMajorTitle}>복수전공 수강내역</div>
          </div>
          <div className={styles.dualMajorSpacing}></div>
          {dualMajorAreas.map((area, index) => (
            <div key={area.areaType}>
              <CourseAccordion
                title={area.displayName}
                currentCredits={area.earnedCredits}
                requiredCredits={area.requiredCredits}
                requiredElectiveCredits={area.requiredElectiveCourses}
                isCompleted={area.isCompleted}
                courses={area.courses}
              />
              {index < dualMajorAreas.length - 1 && (
                <div className={styles.spacing}></div>
              )}
            </div>
          ))}
        </>
      )}
    </>
  );
}
