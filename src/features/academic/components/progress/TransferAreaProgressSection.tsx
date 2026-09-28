'use client';

import { useState } from 'react';
import { Icon } from '@/components/ui';
import { useTransferAreaProgress } from '../../hooks/useAcademicProgress';
import type { TransferProgress } from '../../types/graduation';
import { formatRecognizedTransferCredits, isDesignatedCoursesCompleted } from '../../utils/transferProgressUtils';
import { CourseAccordion } from '../shared/Accordion';
import styles from './AreaProgressSection.module.scss';
import DesignatedCourseList from './DesignatedCourseList/DesignatedCourseList';
import { TransferProgressInfoDialog } from './TransferProgressInfoDialog/TransferProgressInfoDialog';

interface TransferAreaProgressSectionProps {
  progress: TransferProgress;
}

// 편입생 영역별 이수현황.
//  1) 맨 위 '지정과목 | 이수한 학점' 카드 — 펼치면 지정과목별 이수 여부, 학점 옆 (i) 로 표시 형식 안내.
//  2) 전핵·전선(COMPARISON) 은 기존과 같은 "이수 / 기준" 표시.
//  3) 그 외(EARNED_ONLY·UNAVAILABLE) 는 이수한 학점만 표시.
//  4) 맨 아래 '기타' 그룹 — 전적대 인정학점. 화면에서만 묶는 그룹이며 전공·교양·일선으로 재분류하지 않는다.
// 카드 외형·간격은 AreaProgressSection 과 같은 SCSS 모듈을 공유해 일반 학생 화면과 동일하게 유지한다.
export default function TransferAreaProgressSection({ progress }: TransferAreaProgressSectionProps) {
  const { mainMajorAreas, dualMajorAreas } = useTransferAreaProgress(progress.areas);
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  const designatedCourses = progress.designatedCourses ?? [];
  const designatedEarnedCredits = progress.designatedEarnedCredits ?? null;
  const isDesignatedCompleted = isDesignatedCoursesCompleted(designatedCourses);

  // 지정과목 학점 뒤 정보 아이콘 — accordion 토글과 분리(stopPropagation). 일선 안내 버튼과 동일 패턴.
  const infoButton = (
    <button
      type="button"
      className={styles.infoButton}
      aria-label="편입생 졸업요건 안내 보기"
      onClick={e => {
        e.stopPropagation();
        setIsInfoOpen(true);
      }}
    >
      <Icon name="info" size={20} />
    </button>
  );

  return (
    <>
      <CourseAccordion
        title="지정과목"
        currentCredits={designatedEarnedCredits ?? 0}
        creditsLabel={designatedEarnedCredits == null ? '학점 확인 불가' : undefined}
        isCompleted={isDesignatedCompleted}
        trailingAdornment={infoButton}
      >
        <DesignatedCourseList
          courses={designatedCourses}
          isCompleted={isDesignatedCompleted}
          needsRefresh={progress.designatedCoursesNeedsRefresh}
        />
      </CourseAccordion>
      {(mainMajorAreas.length > 0 || dualMajorAreas.length > 0) && <div className={styles.spacing}></div>}

      {/* 주전공 영역들 */}
      {mainMajorAreas.map((area, index) => (
        <div key={area.areaType}>
          <CourseAccordion
            title={area.displayName}
            currentCredits={area.earnedCredits}
            requiredCredits={area.requiredCredits ?? undefined}
            isCompleted={area.isCompleted}
            courses={area.courses}
          />
          {(index < mainMajorAreas.length - 1 || dualMajorAreas.length > 0) && <div className={styles.spacing}></div>}
        </div>
      ))}

      {/* 복수전공 섹션 */}
      {dualMajorAreas.length > 0 && (
        <>
          <div className={styles.dualMajorTitle}>복수전공 수강내역</div>
          {dualMajorAreas.map((area, index) => (
            <div key={area.areaType}>
              <CourseAccordion
                title={area.displayName}
                currentCredits={area.earnedCredits}
                requiredCredits={area.requiredCredits ?? undefined}
                isCompleted={area.isCompleted}
                courses={area.courses}
              />
              {index < dualMajorAreas.length - 1 && <div className={styles.spacing}></div>}
            </div>
          ))}
        </>
      )}

      {/* 기타 — 전적대 인정학점 (totalEarnedCredits 에 이미 포함, 합산하지 않음) */}
      <div className={styles.dualMajorTitle}>기타</div>
      <CourseAccordion
        title="전적대 인정학점"
        currentCredits={progress.recognizedTransferCredits ?? 0}
        creditsLabel={formatRecognizedTransferCredits(progress.recognizedTransferCredits)}
        isCompleted={false}
      >
        <p className={styles.note}>편입 시 인정받은 학점이며, 총 취득학점에 포함돼요.</p>
      </CourseAccordion>

      <TransferProgressInfoDialog isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
}
