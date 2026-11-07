'use client';

import Image from 'next/image';
import { useProfileQuery } from '@/features/dashboard/apis/queries/useProfileQuery';
import { getProfileImagePath } from '../../../../app/(main)/utils/getProfileImagePath';
import styles from './ProfileCard.module.scss';

export interface ProfileCardViewProps {
  name: string;
  majorName: string;
  studentCode: string;
  gradeLevel: number;
  currentSemester: number;
  status: string;
}

export const ProfileCardView = ({
  name,
  majorName,
  studentCode,
  gradeLevel,
  currentSemester,
  status,
}: ProfileCardViewProps) => {
  const profileImagePath = getProfileImagePath(status, gradeLevel);

  return (
    <div className={styles.container}>
      <div className={styles.profileImage}>
        <Image
          src={profileImagePath}
          alt={`${status} ${gradeLevel}학년 프로필 이미지`}
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
          <span>{majorName}</span>
          <span className={styles.divider}>I</span>
          <span>{studentCode}</span>
        </div>

        <div className={styles.gradeWrapper}>
          <span className={styles.grade}>
            {gradeLevel}학년 {currentSemester}학기
          </span>
          <div className={styles.statusBadge}>
            <span>{status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = () => {
  const { data } = useProfileQuery();

  return (
    <ProfileCardView
      name={data.name}
      majorName={data.majorName}
      studentCode={data.studentCode}
      gradeLevel={data.gradeLevel}
      currentSemester={data.currentSemester}
      status={data.status}
    />
  );
};

export default ProfileCard;
