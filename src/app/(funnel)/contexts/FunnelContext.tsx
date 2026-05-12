'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { StudentInfoSummary } from '@/shared/api/data-contracts';

interface FunnelContextType {
  studentInfo: StudentInfoSummary | null;
  setStudentInfo: (info: StudentInfoSummary) => void;
  jobId: string | null;
  setJobId: (id: string) => void;
}

const FunnelContext = createContext<FunnelContextType | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfoSummary | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);

  return (
    <FunnelContext.Provider value={{ studentInfo, setStudentInfo, jobId, setJobId }}>
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnelContext() {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnelContext must be used within a FunnelProvider');
  }
  return context;
}
