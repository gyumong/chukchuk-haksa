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
  completedSemesters: number; // 이수학기
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
  areaCode?: number; // 정규화된 영역 코드 (1~7)
  originalAreaCode?: number; // 학교 원본 코드 (33, 43 등)
  originalScore?:number; // 원 점수 (93,86 등)
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

interface ProcessedSemesterGrade {
  year: number;
  semester: number; // 학기 코드 (10, 15, 20, 25)
  attemptedCredits: number; // 신청 학점
  earnedCredits: number; // 취득 학점
  semesterGpa: number; // 학기 평점
  semesterPercentile: number; // 학기 백분위
  classRank: number | null; // 석차
  totalStudents: number | null; // 전체 학생 수
}

interface ProcessedTotalGrade {
  totalAttemptedCredits: number; // 총 신청학점
  totalEarnedCredits: number; // 총 취득학점
  cumulativeGpa: number; // 전체 평점평균
  percentile: number; // 전체 백분위
}

interface MergedSemester {
  semester: string;
  courses: PartialCourseData[];
}

interface AcademicRecords {
  semesters: ProcessedSemesterGrade[];
  total: ProcessedTotalGrade;
}

export type {
  Credit,
  Course,
  MergedSemester,
  Student,
  PartialCourseData,
  ProcessedSemesterGrade,
  ProcessedTotalGrade,
  AcademicRecords,
};
