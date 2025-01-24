import Image from 'next/image';
import styles from './ProfileCard.module.scss';

interface Props {
  name: string;
  department: string;
  studentId: string;
  grade: number;
  semester: number;
  status: '재학' | '휴학' | '졸업'; // 필요한 상태 추가 가능
}

export default function ProfileCard({ name, department, studentId, grade, semester, status }: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.profileImage}>
        <Image
          src="/images/illustrations/DefaultProfile.png"
          alt="프로필 이미지"
          width={102}
          height={102}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.nameWrapper}>
          <span className={styles.name}>{name}</span>
          <span className={styles.suffix}>님</span>
        </div>

        <div className={styles.details}>
          <span>{department}</span>
          <span className={styles.divider}>I</span>
          <span>{studentId}</span>
        </div>

        <div className={styles.gradeWrapper}>
          <span className={styles.grade}>
            {grade}학년 {semester}학기
          </span>
          <div className={styles.statusBadge}>
            <span>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
