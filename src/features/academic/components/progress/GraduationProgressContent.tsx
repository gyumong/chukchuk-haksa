import AsyncBoundary from '@/shared/components/AsyncBoundary';
import GraduationProgressHeader from './GraduationProgressHeader';
import AcademicSummarySection from './AcademicSummarySection';
import AreaProgressSection from './AreaProgressSection';
import styles from './GraduationProgressContent.module.scss';

function GraduationProgressContent() {
  return (
    <div className={styles.container}>
      <AsyncBoundary>
        <GraduationProgressHeader />
      </AsyncBoundary>
      <AsyncBoundary>
        <AcademicSummarySection />
      </AsyncBoundary>
      <AsyncBoundary>
        <AreaProgressSection />
      </AsyncBoundary>
    </div>
  );
}

export default GraduationProgressContent;