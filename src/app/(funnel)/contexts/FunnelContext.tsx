'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { StudentInfo } from '@/shared/api/data-contracts';

interface FunnelContextType {
  studentInfo: StudentInfo | null;
  setStudentInfo: (info: StudentInfo) => void;
}

const FunnelContext = createContext<FunnelContextType | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  return <FunnelContext.Provider value={{ studentInfo, setStudentInfo }}>{children}</FunnelContext.Provider>;
}

export function useStudentInfo() {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useStudentInfo must be used within a FunnelProvider');
  }
  return context;
}
