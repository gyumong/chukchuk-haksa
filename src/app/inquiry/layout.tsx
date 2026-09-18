'use client';

import type { PropsWithChildren } from 'react';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';

export default function InquiryLayout({ children }: PropsWithChildren) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}