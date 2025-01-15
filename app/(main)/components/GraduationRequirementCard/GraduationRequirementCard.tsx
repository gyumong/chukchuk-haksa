import { Icon } from '@/components/ui';
import styles from './GraduationRequirementCard.module.scss';

interface Props {
  majorType: '주전공' | '복수전공' | '부전공';
  admissionYear: number;
  department: string;
  earnedCredits: number;
  requiredCredits: number;
  handleGraduationProgress: () => void;
}

export default function GraduationRequirementCard({
  majorType,
  admissionYear,
  department,
  earnedCredits,
  requiredCredits,
  handleGraduationProgress,
}: Props) {
  return (
    <div className={styles.container}>
      <span className={styles.majorType}>{majorType}</span>

      <div className={styles.requirementHeader}>
        <span className={styles.title}>
          {admissionYear}학번 {department} 졸업요건
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
}
