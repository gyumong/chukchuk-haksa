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
  courses?: Course[];
}

interface CourseAreaTriggerProps {
  title: string;
  currentCredits: number;
  requiredCredits: number;
  isCompleted: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

interface CourseListProps {
  courses: Course[];
  isCompleted: boolean;
}

export type { CourseAreaProps, CourseAreaTriggerProps, CourseListProps };
