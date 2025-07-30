'use client';

import { Suspense } from 'react';
import AcademicDetailContent from '@/features/academic/components/detail/AcademicDetailContent';

export default function AcademicDetailPage() {
  return (
    <Suspense fallback={<div></div>}>
      <AcademicDetailContent />
    </Suspense>
  );
}
