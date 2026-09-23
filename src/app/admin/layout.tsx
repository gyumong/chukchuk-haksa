'use client';

import type { PropsWithChildren } from 'react';
import AdminRoute from '@/features/admin/components/AdminRoute';

export default function AdminLayout({ children }: PropsWithChildren) {
  return <AdminRoute>{children}</AdminRoute>;
}