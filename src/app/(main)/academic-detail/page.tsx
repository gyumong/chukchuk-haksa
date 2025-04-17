'use client';

import { Suspense } from 'react';
import AcademicDetailContent from './components/AcademicDetailContent';


export default function AcademicDetailPage() {
  return (
    <Suspense fallback={<div></div>}>
      <AcademicDetailContent />
    </Suspense>
  );
}

