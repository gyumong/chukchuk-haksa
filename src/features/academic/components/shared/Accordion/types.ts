import type { ReactNode } from 'react';
import type { CourseDto } from '@/shared/api/data-contracts';

type Course = CourseDto;

interface CourseAreaProps {
  title: string;
  currentCredits: number;
  requiredCredits: number;
  isCompleted: boolean;
  /** 이수해야 하는 선택 영역 수 (선교: requiredElectiveCourses). */
  requiredElectiveAreas?: number;
  /** 이수한 선택 영역 수 (선교: completedElectiveCourses). */
  completedElectiveAreas?: number;
  courses?: Course[];
  /** 학점 표시 뒤(행 끝)에 붙일 부가 요소 (예: 정보 아이콘 버튼). */
  trailingAdornment?: ReactNode;
}

interface CourseAreaTriggerProps {
  title: string;
  currentCredits: number;
  requiredCredits: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onClick: () => void;
  /** 이수해야 하는 선택 영역 수 (선교: requiredElectiveCourses). */
  requiredElectiveAreas?: number;
  currentElectiveCourses?: number;
  /** 이수한 선택 영역 수 (선교: completedElectiveCourses). */
  completedElectiveAreas?: number;
  /** 학점 표시 뒤(행 끝)에 붙일 부가 요소. */
  trailingAdornment?: ReactNode;
}

interface CourseListProps {
  courses: Course[];
  isCompleted: boolean;
}

export type { CourseAreaProps, CourseAreaTriggerProps, CourseListProps };
