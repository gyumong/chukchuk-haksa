import { Icon } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAcademicSummaryQuery } from '@/features/dashboard/apis/queries/useAcademicSummaryQuery';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { type RoutePath, useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './GraduationRequirementCard.module.scss';

/**
 * 졸업 요건 정보를 보여주는 카드 컴포넌트
 *
 * @dependencies
 * - useProfileQuery: 학생 프로필 정보 (학번, 학과명)
 * - useAcademicSummaryQuery: 학업 요약 정보 (이수 학점, 필수 학점)
 */

const GraduationRequirementCard = () => {
  const router = useInternalRouter();

  const { data: profileData } = useProfileQuery();
  const { data: summaryData } = useAcademicSummaryQuery();

  const admissionYear = profileData.studentCode.slice(0, 2);
  const departmentName = profileData.departmentName ?? profileData.majorName;

  const earnedCredits = summaryData.totalEarnedCredits;
  const requiredCredits = summaryData.requiredCredits;

  const handleGraduationProgress = () => {
    router.push(`${ROUTES.GRADUATION_PROGRESS}/${parseInt(admissionYear)}/${departmentName}` as RoutePath);
  };

  return (
    <div className={styles.container}>
      <span className={styles.majorType}>주전공</span>

      <div className={styles.requirementHeader}>
        <span className={styles.title}>
          {admissionYear}학번 {departmentName} 졸업요건
        </span>
        <button className={styles.arrowButton} onClick={handleGraduationProgress}>
          <Icon name="arrow-right" />
        </button>
      </div>

      <div className={styles.creditInfo}>
        <div className={styles.earnedMessage}>
          <span>총 </span>
          <span className={styles.highlight}>{earnedCredits}</span>
          <span> 학점을 이수했어요 🎉</span>
        </div>
        <div className={styles.creditProgress}>
          {earnedCredits} / {requiredCredits}
        </div>
      </div>
    </div>
  );
};

export default GraduationRequirementCard;
