import AcademicSummaryCard from '@/app/(main)/components/AcademicSummaryCard/AcademicSummaryCard';
import type { AcademicSummary } from '../../types/graduation';

interface AcademicSummarySectionProps {
  academicSummary: AcademicSummary;
}

export default function AcademicSummarySection({ academicSummary }: AcademicSummarySectionProps) {
  return (
    <>
      <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>전체 수강내역</div>
      <div style={{ marginBottom: '12px' }}></div>
      <AcademicSummaryCard
        earnedCredits={academicSummary.totalEarnedCredits}
        gpa={academicSummary.cumulativeGpa}
        percentile={academicSummary.percentile}
      />
      <div style={{ marginBottom: '12px' }}></div>
    </>
  );
}