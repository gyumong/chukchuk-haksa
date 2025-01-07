import type { StudentStatus } from './enums';

// 도메인 모델: Student (학생)
interface Student {
  studentCode: string; // 학번
  name: string; // 학생 이름
  departmentCode: string; // 학과 ID
  departmentName: string; // 학과 이름
  majorCode: string; // 주전공 ID
  majorName: string; // 주전공 이름
  secondaryMajorCode?: string; // 복수전공 ID (선택적)
  secondaryMajorName?: string; // 복수전공 이름 (선택적)
  admissionYear: number; // 입학 연도
  semesterEnrolled: number; // 입학 학기 (예: 202410 -> 2024년 1학기)
  isTransferStudent: boolean; // 편입 여부
  admissionType: string; // 입학 유형 (예: 신입학, 편입학 등)
  isGraduated: boolean; // 졸업 여부
  status: StudentStatus;
  gradeLevel: number; // 학년 (예: 1, 2, 3, 4)
}

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
  categoryCode?: number;
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
  facultyDivisionCode: number;
  points: number;
  professorName: string;
  subjectEstablishmentYearSemester: string;
  subjectEstablishmentSemesterCode: string;
  facultyDivisionName: string;
  subjectCode: string;
  subjectEstablishmentYear: number;
  semester?: string;
}

type PartialCourseData = Credit & Partial<Course>;

interface MergedSemester {
  semester: string;
  courses: PartialCourseData[];
}

export type { Credit, Course, MergedSemester, Student, PartialCourseData };
