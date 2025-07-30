'use client';

import { TopNavigation } from '@/components/ui/TopNavigation';
import { useGraduationNavigation } from '@/features/academic/hooks/useGraduationNavigation';
import styles from './layout.module.scss';

function GraduationNavigationHeader() {
  const { navigationTitle, handleBack, isLoading } = useGraduationNavigation();

  if (isLoading) {
    return (
      <TopNavigation.Preset 
        title="졸업요건" 
        type="back" 
        onNavigationClick={handleBack} 
      />
    );
  }

  return (
    <TopNavigation.Preset 
      title={navigationTitle} 
      type="back" 
      onNavigationClick={handleBack} 
    />
  );
}

export default function GraduationProgressLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <GraduationNavigationHeader />
      <div className={styles.content}>{children}</div>
    </div>
  );
}