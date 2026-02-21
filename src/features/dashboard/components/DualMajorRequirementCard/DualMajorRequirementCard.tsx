import { ROUTES } from '@/constants';
import { useGraduationProgressQuery } from '@/features/academic/apis/queries/useGraduationProgressQuery';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { calculateDualMajorCredits, separateProgressByMajor } from '@/features/academic/utils/dualMajorUtils';
import { getAdmissionYear } from '@/features/academic/utils/profileUtils';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import RequirementCard from '../RequirementCard/RequirementCard';

/**
 * 복수전공 졸업 요건 정보를 보여주는 카드 컴포넌트
 */
const DualMajorRequirementCard = () => {
  const router = useInternalRouter();

  const { data: profileData } = useProfileQuery();
  const { data: graduationData } = useGraduationProgressQuery();

  if (!profileData || !graduationData) {
    return null;
  }

  const { dualMajorProgress, hasDualMajor } = separateProgressByMajor(graduationData);

  if (!hasDualMajor) {
    return null;
  }

  const admissionYear = getAdmissionYear(profileData.studentCode);
  const dualMajorName = profileData.dualMajorName ?? '복수전공';
  const title = `${admissionYear}학번 ${dualMajorName} 졸업요건`;
  const { earnedCredits, requiredCredits } = calculateDualMajorCredits(dualMajorProgress);

  return (
    <RequirementCard
      majorTypeLabel="복수전공"
      title={title}
      earnedCredits={earnedCredits}
      requiredCredits={requiredCredits}
      onNavigate={() => router.push(ROUTES.GRADUATION_PROGRESS)}
    />
  );
};

export default DualMajorRequirementCard;