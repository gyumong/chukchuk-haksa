'use client';

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface StudentInfo {
  name: string;
  school: string;
  majorName: string;
  studentCode: string;
  gradeLevel: string;
  status: string;
}

interface FunnelContextType {
  studentInfo: StudentInfo | null;
  setStudentInfo: (info: StudentInfo) => void;
}

const FunnelContext = createContext<FunnelContextType | null>(null);

export function FunnelProvider({ children }: { children: ReactNode }) {
  const [studentInfo, setStudentInfo] = useState<StudentInfo>({
    name: '',
    school: '수원대학교',
    majorName: '',
    studentCode: '',
    gradeLevel: '',
    status: '',
  });

  return <FunnelContext.Provider value={{ studentInfo, setStudentInfo }}>{children}</FunnelContext.Provider>;
}

export function useStudentInfo() {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useStudentInfo must be used within a FunnelProvider');
  }
  return context;
}
