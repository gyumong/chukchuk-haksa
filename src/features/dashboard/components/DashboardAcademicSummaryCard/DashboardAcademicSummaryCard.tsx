import AcademicStatsCard from '@/components/academic/AcademicStatsCard/AcademicStatsCard';
import { useAcademicSummaryQuery } from '../../apis/queries/useAcademicSummaryQuery';

const DashboardAcademicSummaryCard = () => {
  const { data } = useAcademicSummaryQuery();

  if (!data) {
    return null;
  }

  const rankInfo = {
    type: 'percentile' as const,
    value: data.percentile ?? '-',
  };

  return <AcademicStatsCard earnedCredits={data.totalEarnedCredits} gpa={data.cumulativeGpa} rankInfo={rankInfo} />;
};

export default DashboardAcademicSummaryCard;
