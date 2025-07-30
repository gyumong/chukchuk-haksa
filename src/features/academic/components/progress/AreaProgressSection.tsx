import { CourseAccordion } from '@/app/(main)/components/Accordion';
import type { AreaProgress, CourseAreaType } from '../../types/graduation';

interface AreaProgressSectionProps {
  areaProgress: AreaProgress[];
}

export default function AreaProgressSection({ areaProgress }: AreaProgressSectionProps) {
  const getAreaDisplayName = (areaType: CourseAreaType): string => {
    const areaNames: Record<CourseAreaType, string> = {
      '중핵': '중핵교양',
      '기교': '기초교양',
      '선교': '선택교양',
      '소교': '소양교양',
      '전교': '전공교양',
      '전취': '전공취업',
      '전핵': '전공핵심',
      '전선': '전공선택',
      '일선': '일반선택',
      '복선': '복수전공선택',
    };
    return areaNames[areaType] || areaType;
  };

  return (
    <>
      {areaProgress.map((area, index) => (
        <div key={area.areaType}>
          <CourseAccordion
            title={getAreaDisplayName(area.areaType)}
            currentCredits={area.earnedCredits}
            requiredCredits={area.requiredCredits}
            requiredElectiveCredits={area.requiredElectiveCourses}
            isCompleted={area.earnedCredits >= area.requiredCredits && area.completedElectiveCourses >= area.requiredElectiveCourses}
            courses={area.courses}
          />
          {index < areaProgress.length - 1 && (
            <div style={{ marginBottom: '12px' }}></div>
          )}
        </div>
      ))}
    </>
  );
}