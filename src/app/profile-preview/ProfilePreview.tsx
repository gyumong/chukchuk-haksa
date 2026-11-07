'use client';

import type { ProfileCardViewProps } from '@/features/dashboard/components/ProfileCard/ProfileCard';
import { ProfileCardView } from '@/features/dashboard/components/ProfileCard/ProfileCard';
import styles from './page.module.scss';

const BASE: ProfileCardViewProps = {
  name: '김척척',
  majorName: '정보통신학부',
  studentCode: '17234032',
  gradeLevel: 3,
  currentSemester: 2,
  status: '재학',
};

const SCENARIOS: Array<{ label: string; data: ProfileCardViewProps }> = [
  { label: '재학 1학년', data: { ...BASE, gradeLevel: 1 } },
  { label: '재학 2학년', data: { ...BASE, gradeLevel: 2 } },
  { label: '재학 3학년', data: BASE },
  { label: '재학 4학년', data: { ...BASE, gradeLevel: 4 } },
  { label: '휴학', data: { ...BASE, status: '휴학' } },
  { label: '졸업 (4학년 이미지)', data: { ...BASE, status: '졸업' } },
  { label: '기본 (5학년 이상)', data: { ...BASE, gradeLevel: 5 } },
];

export default function ProfilePreview() {
  return (
    <main className={styles.page}>
      {SCENARIOS.map(({ label, data }) => (
        <div key={label} className={styles.scenario}>
          <p className={styles.label}>{label}</p>
          <ProfileCardView {...data} />
        </div>
      ))}
    </main>
  );
}
