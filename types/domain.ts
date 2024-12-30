// 도메인 모델: Credit (성적)
interface Credit {
  studentNumber: string;
  grade: string;
  gpa: number;
  courseName: string;
  department: string;
  facultyDivisionName: string;
  points: number;
  courseCode: string;
  totalScore: number;
  semester?: string;
}

// 도메인 모델: Course (수강 정보)
interface Course {
  studentNumber: string;
  courseNumber: string;
  scheduleSummary: string;
  departmentName: string;
  courseName: string;
  retakeYearSemester: string;
  isClosed: boolean;
  facultyDivisionCode: string;
  points: number;
  professorName: string;
  subjectEstablishmentYearSemester: string;
  subjectEstablishmentSemesterCode: string;
  facultyDivisionName: string;
  subjectCode: string;
  subjectEstablishmentYear: number;
  semester?: string;
}

interface MergedSemester {
  semester: string;
  courses: Array<Credit & Partial<Course>>;
}

export type { Credit, Course, MergedSemester };
