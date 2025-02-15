import Image from 'next/image';
import type { StudentStatus } from '../../constants/profile';
import { getProfileImagePath } from '../../utils/getProfileImagePath';
import styles from './ProfileCard.module.scss';

interface Props {
  name: string;
  department: string;
  studentId: string;
  grade: number;
  semester: number;
  status: StudentStatus;
}

export default function ProfileCard({ name, department, studentId, grade, semester, status }: Props) {
  const profileImagePath = getProfileImagePath(status, grade);
  return (
    <div className={styles.container}>
      <div className={styles.profileImage}>
        <Image
          src={profileImagePath}
          alt={`${status} ${grade}학년 프로필 이미지`}
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
