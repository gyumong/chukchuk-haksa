import { ROUTES } from '@/constants';
import { useAcademicSummaryQuery } from '@/features/dashboard/apis/queries/useAcademicSummaryQuery';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { getAdmissionYear, getDepartmentName } from '@/features/academic/utils/profileUtils';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import RequirementCard from '../RequirementCard/RequirementCard';

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

  if (!profileData || !summaryData) {
    return null;
  }

  const admissionYear = getAdmissionYear(profileData.studentCode);
  const departmentName = getDepartmentName(profileData);
  const title = `${admissionYear}학번 ${departmentName} 졸업요건`;

  return (
    <RequirementCard
      majorTypeLabel="주전공"
      title={title}
      earnedCredits={summaryData.totalEarnedCredits}
      requiredCredits={summaryData.requiredCredits}
      onNavigate={() => router.push(ROUTES.GRADUATION_PROGRESS)}
    />
  );
};

export default GraduationRequirementCard;
