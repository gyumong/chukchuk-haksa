import AcademicStatsCard from '@/components/academic/AcademicStatsCard/AcademicStatsCard';
import { useAcademicSummaryQuery } from '../../server/queries/useAcademicSummaryQuery';

const DashboardAcademicSummaryCard = () => {
  const { data } = useAcademicSummaryQuery();

  const rankInfo = {
    type: 'percentile' as const,
    value: data.percentile ?? '-',
  };

  return <AcademicStatsCard earnedCredits={data.totalEarnedCredits} gpa={data.cumulativeGpa} rankInfo={rankInfo} />;
};

export default DashboardAcademicSummaryCard;
