import AsyncBoundary from '@/shared/components/AsyncBoundary';
import GraduationProgressHeader from './GraduationProgressHeader';
import AcademicSummarySection from './AcademicSummarySection';
import GraduationAreaSection from './GraduationAreaSection';
import RequiredCompletionSection from './RequiredCompletionSection';
import FirstYearRequirementNotice from './FirstYearRequirementNotice/FirstYearRequirementNotice';
import { GraduationRequirementErrorFallback, SemesterGradeErrorFallback } from './firstYearFallbacks';
import styles from './GraduationProgressContent.module.scss';

function GraduationProgressContent() {
  return (
    <div className={styles.container}>
      <FirstYearRequirementNotice />
      <AsyncBoundary customErrorFallback={SemesterGradeErrorFallback}>
        <GraduationProgressHeader />
      </AsyncBoundary>
      <AsyncBoundary>
        <AcademicSummarySection />
      </AsyncBoundary>
      <AsyncBoundary customErrorFallback={GraduationRequirementErrorFallback}>
        <GraduationAreaSection />
      </AsyncBoundary>
      <AsyncBoundary customErrorFallback={GraduationRequirementErrorFallback}>
        <RequiredCompletionSection />
      </AsyncBoundary>
    </div>
  );
}

export default GraduationProgressContent;
