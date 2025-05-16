'use client';

import Image from 'next/image';
import { useProfileQuery } from '@/features/dashboard/server/queries/useProfileQuery';
import { getProfileImagePath } from '../../../../app/(main)/utils/getProfileImagePath';
import styles from './ProfileCard.module.scss';

const ProfileCard = () => {
  const { data } = useProfileQuery();

  const profileImagePath = getProfileImagePath(data.status, data.gradeLevel);
  return (
    <div className={styles.container}>
      <div className={styles.profileImage}>
        <Image
          src={profileImagePath}
          alt={`${data.status} ${data.gradeLevel}학년 프로필 이미지`}
          width={102}
          height={102}
          className={styles.image}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.nameWrapper}>
          <span className={styles.name}>{data.name}</span>
          <span className={styles.suffix}>님</span>
        </div>

        <div className={styles.details}>
          <span>{data.majorName}</span>
          <span className={styles.divider}>I</span>
          <span>{data.studentCode}</span>
        </div>

        <div className={styles.gradeWrapper}>
          <span className={styles.grade}>
            {data.gradeLevel}학년 {data.currentSemester}학기
          </span>
          <div className={styles.statusBadge}>
            <span>{data.status}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
