import type { ReactNode } from 'react';
import type { CourseDto } from '@/shared/api/data-contracts';

type Course = CourseDto;

interface CourseAreaProps {
  title: string;
  currentCredits: number;
  requiredCredits: number;
  isCompleted: boolean;
  requiredElectiveCredits?: number;
  courses?: Course[];
  /** 제목 옆에 표시할 부가 요소 (예: 정보 아이콘 버튼). */
  titleAdornment?: ReactNode;
}

interface CourseAreaTriggerProps {
  title: string;
  currentCredits: number;
  requiredCredits: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onClick: () => void;
  requiredElectiveCredits?: number;
  currentElectiveCourses?: number;
  /** 제목 옆에 표시할 부가 요소. */
  titleAdornment?: ReactNode;
}

interface CourseListProps {
  courses: Course[];
  isCompleted: boolean;
}

export type { CourseAreaProps, CourseAreaTriggerProps, CourseListProps };
