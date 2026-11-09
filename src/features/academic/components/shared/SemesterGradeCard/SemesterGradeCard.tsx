import { Icon } from '@/components/ui';
import styles from './SemesterGradeCard.module.scss';

type SemesterGradeCardProps =
  | {
      startSemester: string;
      endSemester: string;
      onClick?: () => void;
      disabledMessage?: never;
    }
  | {
      /** 성적 조회를 아직 할 수 없을 때 학기 범위 대신 보여줄 안내. 주어지면 카드가 비활성화된다. */
      disabledMessage: string;
      startSemester?: never;
      endSemester?: never;
      onClick?: never;
    };

export default function SemesterGradeCard(props: SemesterGradeCardProps) {
  if (props.disabledMessage !== undefined) {
    return (
      <div className={`${styles.container} ${styles.disabled}`} aria-disabled="true">
        <div className={styles.content}>
          <div className={styles.title}>학기별 세부 성적 확인하기</div>
          <div className={styles.semester}>{props.disabledMessage}</div>
        </div>
        <span className={styles.button} aria-hidden="true">
          <Icon name="arrow-right" size={24} />
        </span>
      </div>
    );
  }

  const { startSemester, endSemester, onClick } = props;

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
