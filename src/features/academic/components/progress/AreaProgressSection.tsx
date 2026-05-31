import { useState } from 'react';
import { Icon } from '@/components/ui';
import { useGraduationProgressQuery } from '../../apis/queries/useGraduationProgressQuery';
import { useAreaProgress } from '../../hooks/useAcademicProgress';
import { CourseAccordion } from '../shared/Accordion';
import { GeneralElectiveInfoDialog } from './GeneralElectiveInfoDialog/GeneralElectiveInfoDialog';
import styles from './AreaProgressSection.module.scss';

export default function AreaProgressSection() {
  const { data: graduationProgress } = useGraduationProgressQuery();
  const { mainMajorAreas, dualMajorAreas } = useAreaProgress(graduationProgress);
  const [isGeneralElectiveInfoOpen, setIsGeneralElectiveInfoOpen] = useState(false);

  // '일반선택'(일선) 영역 학점 뒤 정보 아이콘 — 클릭 시 설명 팝업. accordion 토글과 분리(stopPropagation).
  const generalElectiveInfoButton = (
    <button
      type="button"
      className={styles.infoButton}
      aria-label="일반선택 안내 보기"
      onClick={e => {
        e.stopPropagation();
        setIsGeneralElectiveInfoOpen(true);
      }}
    >
      <Icon name="info" size={20} className={styles.infoIcon} />
    </button>
  );

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
            trailingAdornment={area.areaType === '일선' ? generalElectiveInfoButton : undefined}
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
                trailingAdornment={area.areaType === '일선' ? generalElectiveInfoButton : undefined}
              />
              {index < dualMajorAreas.length - 1 && (
                <div className={styles.spacing}></div>
              )}
            </div>
          ))}
        </>
      )}

      <GeneralElectiveInfoDialog
        isOpen={isGeneralElectiveInfoOpen}
        onClose={() => setIsGeneralElectiveInfoOpen(false)}
      />
    </>
  );
}
