import AcademicStatsCard from '@/components/academic/AcademicStatsCard/AcademicStatsCard';
import { useAcademicSummaryQuery } from '../../apis/queries/useAcademicSummaryQuery';

const DashboardAcademicSummaryCard = () => {
  const { data } = useAcademicSummaryQuery();

  if (!data) {
    return null;
  }

  return (
    <AcademicStatsCard earnedCredits={data.totalEarnedCredits} gpa={data.cumulativeGpa} percentile={data.percentile} />
  );
};

export default DashboardAcademicSummaryCard;
