interface Course {
  name: string;
  semester: string;
  credits: number;
  grade: string;
}

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
