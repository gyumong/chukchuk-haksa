'use client';;
import { use } from "react";

import { useRouter } from 'next/navigation';
import { TopNavigation } from '@/components/ui/TopNavigation';
import styles from './layout.module.scss';

export default function GraduationProgressLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ studentCode: string; department: string }>;
  }
) {
  const params = use(props.params);

  const {
    children
  } = props;

  const router = useRouter();
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
