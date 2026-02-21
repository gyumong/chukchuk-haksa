import { Icon } from '@/components/ui';
import styles from '../GraduationRequirementCard/GraduationRequirementCard.module.scss';

interface RequirementCardProps {
  majorTypeLabel: string;
  title: string;
  earnedCredits: number;
  requiredCredits: number;
  onNavigate: () => void;
}

const RequirementCard = ({
  majorTypeLabel,
  title,
  earnedCredits,
  requiredCredits,
  onNavigate,
}: RequirementCardProps) => {
  return (
    <div className={styles.container}>
      <span className={styles.majorType}>{majorTypeLabel}</span>

      <div className={styles.requirementHeader}>
        <span className={styles.title}>{title}</span>
        <button className={styles.arrowButton} onClick={onNavigate}>
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
};

export default RequirementCard;
