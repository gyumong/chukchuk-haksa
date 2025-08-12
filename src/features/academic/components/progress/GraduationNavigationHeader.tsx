'use client';

import { Suspense } from 'react';
import { TopNavigation } from '@/components/ui/TopNavigation';
import { useGraduationNavigation } from '../../hooks/useGraduationNavigation';

function GraduationNavigationContent() {
  const { navigationTitle, handleBack } = useGraduationNavigation();

  return (
    <TopNavigation.Preset title={navigationTitle} type="back" onNavigationClick={handleBack} />
  );
}

function GraduationNavigationHeader() {
  return (
    <Suspense fallback={<TopNavigation.Preset title="졸업요건" type="back" onNavigationClick={() => {}} />}>
      <GraduationNavigationContent />
    </Suspense>
  );
}

export default GraduationNavigationHeader;