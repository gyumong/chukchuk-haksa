'use client';

import { useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './layout.module.scss';

export default function GraduationProgressLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { studentCode: string; department: string };
}) {
  const router = useRouter();
  const { studentCode, department } = params;
  const decodedDepartment = decodeURIComponent(department);
  return (
    <div className={styles.container}>
      <TopNavigation.Preset
        title={`${studentCode ? `${studentCode} ` : ''}학번 ${decodedDepartment || ''} 졸업요건`}
        type="back"
        onNavigationClick={() => router.back()}
      />
      {children}
    </div>
  );
}
