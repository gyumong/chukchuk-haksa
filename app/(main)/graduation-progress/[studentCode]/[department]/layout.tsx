'use client';

import { TopNavigation } from '@/components/ui/TopNavigation';
import { useInternalRouter } from '@/hooks/useInternalRouter';
import styles from './layout.module.scss';

export default function GraduationProgressLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { studentCode: string; department: string };
}) {
  const router = useInternalRouter();
  const { studentCode, department } = params;
  const decodedMajorName = decodeURIComponent(department);
  return (
    <div className={styles.container}>
      <TopNavigation.Preset
        title={`${studentCode ? `${studentCode} ` : ''}학번 ${decodedMajorName || ''} 졸업요건`}
        type="back"
        onNavigationClick={() => router.back()}
      />
      {children}
    </div>
  );
}
