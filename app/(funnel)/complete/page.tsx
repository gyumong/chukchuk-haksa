'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FixedButton } from '@/components/ui';
import { ROUTES } from '@/constants/routes';
import { getSemesterInfo } from '@/lib/utils/semester';
import { FunnelHeadline } from '../components';
import { useStudentInfo } from '../contexts';
import styles from './page.module.scss';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}

export default function Complete() {
  const { studentInfo } = useStudentInfo();
  const router = useRouter();
  const handleNext = () => {
    router.push(`${ROUTES.FUNNEL.TARGET_SCORE}`);
  };
  return (
    <div className={styles.container}>
      <FunnelHeadline
        title={`학교 인증이 완료되었어요!<br/>인증된 정보를 확인해 주세요`}
        highlightText="학교 인증이 완료"
      />
      <div className={styles.content}>
        <div className={styles.contentItem}>
          <div className={styles.nameTagWrapper}>
            <Image
              src="/images/illustrations/NameTag.png"
              alt="Name Tag Illustration"
              fill
              priority
              sizes="(max-width: 768px) 55vw, 226px"
              className={styles.illustration}
              style={{ objectFit: 'contain' }}
            />
            <div className={styles.infoOverlay}>
              <InfoRow label="이름" value={studentInfo?.name ?? ''} />
              <InfoRow label="학교" value={studentInfo?.school ?? ''} />
              <InfoRow label="학과" value={studentInfo?.majorName ?? ''} />
              <InfoRow label="학번" value={studentInfo?.studentCode ?? ''} />
              <InfoRow
                label="학기"
                value={`${studentInfo?.gradeLevel ?? ''}학년 ${getSemesterInfo(parseInt(studentInfo?.gradeLevel ?? '0'), studentInfo?.completedSemesters as number).currentSemester ?? ''}학기`}
              />
              <InfoRow label="재학 여부" value={studentInfo?.status ?? ''} />
            </div>
          </div>
        </div>
        <button className={styles.wrongInfoButton}>입력된 정보가 맞지 않아요</button>
      </div>
      <FixedButton onClick={handleNext}>다음</FixedButton>
    </div>
  );
}
