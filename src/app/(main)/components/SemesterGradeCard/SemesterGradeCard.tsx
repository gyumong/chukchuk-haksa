import { Icon } from '@/components/ui';
import styles from './SemesterGradeCard.module.scss';

interface SemesterGradeCardProps {
  startSemester: string;
  endSemester: string;
  onClick?: () => void;
}

export default function SemesterGradeCard({ startSemester, endSemester, onClick }: SemesterGradeCardProps) {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.content}>
        <div className={styles.title}>학기별 세부 성적 확인하기</div>
        <div className={styles.semester}>
          {startSemester} - {endSemester}
        </div>
      </div>
      <button className={styles.button} onClick={onClick}>
        <Icon name="arrow-right" size={24} />
      </button>
    </div>
  );
}
