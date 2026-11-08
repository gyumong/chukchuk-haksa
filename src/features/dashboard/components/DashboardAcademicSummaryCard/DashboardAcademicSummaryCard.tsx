import { useState } from 'react';
import AcademicStatsCard from '@/components/academic/AcademicStatsCard/AcademicStatsCard';
import { useAcademicSummaryQuery } from '../../apis/queries/useAcademicSummaryQuery';
import { ReferenceRankInfoDialog } from '../ReferenceRankInfoDialog/ReferenceRankInfoDialog';
import ReferenceRankValue from '../ReferenceRankValue/ReferenceRankValue';

const DashboardAcademicSummaryCard = () => {
  const { data } = useAcademicSummaryQuery();
  const [isRankInfoOpen, setIsRankInfoOpen] = useState(false);

  if (!data) {
    return null;
  }

  return (
    <>
      <AcademicStatsCard
        earnedCredits={data.totalEarnedCredits}
        gpa={data.cumulativeGpa}
        rankValue={<ReferenceRankValue />}
        onRankInfoClick={() => setIsRankInfoOpen(true)}
      />
      <ReferenceRankInfoDialog isOpen={isRankInfoOpen} onClose={() => setIsRankInfoOpen(false)} />
    </>
  );
};

export default DashboardAcademicSummaryCard;
