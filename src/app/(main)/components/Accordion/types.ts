import type { CourseDto } from '@/shared/api/data-contracts';

type Course = CourseDto;

interface CourseAreaProps {
  title: string;
  currentCredits: number;
  requiredCredits: number;
  isCompleted: boolean;
  requiredElectiveCredits?: number;
  courses?: Course[];
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
}

interface CourseListProps {
  courses: Course[];
  isCompleted: boolean;
}

export type { CourseAreaProps, CourseAreaTriggerProps, CourseListProps };
