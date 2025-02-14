import type { CourseAreaType, EvaluationType } from '../../../domain/course-offering/models/CourseOffering';
import type { StudentStatusType } from '../../../domain/student/models/AcademicInfo';

// 중간 변환 데이터 타입들 - 비즈니스 로직에서 사용하기 위한 정제된 형태
export interface PortalStudentInfo {
  studentCode: string;
  name: string;
  college: { code: string; name: string };
  department: { code: string; name: string };
  major: { code: string; name: string };
  secondaryMajor?: { code: string; name: string };
  status: StudentStatusType;
  admission: {
    year: number;
    semester: number;
    type: string;
  };
  academic: {
    gradeLevel: number;
    completedSemesters: number;
    totalCredits: number;
    gpa: number;
  };
}

// 포털에서 가져온 모든 데이터를 정제한 최종 형태
export interface PortalData {
  student: PortalStudentInfo;
  academic: PortalAcademicData;
  curriculum: PortalCurriculumData;
}

// 최종적으로 사용될 통합된 학사 정보
export interface PortalAcademicInfo {
  semesters: PortalSemesterInfo[];
  grades: PortalGradeSummary;
  summary: {
    totalCredits: number;
    appliedCredits: number;
    gpa: number;
    score: number;
  };
}

export interface PortalSemesterInfo {
  year: number;
  semester: number;
  courses: PortalCourseInfo[];
}

export interface PortalSemesterGrade {
  year: number;
  semester: number;
  earnedCredits: number;
  appliedCredits: number;
  semesterGpa: number;
  score: number;
  ranking?: {
    rank: number;
    total: number;
  };
}

export interface PortalGradeSummary {
  semesters: PortalSemesterGrade[];
  summary: PortalAcademicSummary;
}

export interface PortalAcademicData {
  semesters: PortalSemesterInfo[];
  grades: PortalGradeSummary;
  summary: PortalAcademicSummary;
}

export interface PortalSemesterInfo {
  year: number;
  semester: number;
  courses: PortalCourseInfo[];
}

export interface PortalCourseInfo {
  code: string;
  name: string;
  professor: string;
  department: string;
  credits: number;
  grade?: string;
  isRetake: boolean;
  schedule: string;
  areaType: string;
  areaCode?: string;
  originalAreaCode?: string;
  establishmentSemester: number;
  originalScore?: number;
}

export interface PortalGradeSummary {
  semesters: PortalSemesterGrade[];
  summary: PortalAcademicSummary;
}

export interface PortalSemesterGrade {
  year: number;
  semester: number;
  earnedCredits: number;
  appliedCredits: number;
  semesterGpa: number;
  score: number;
  ranking?: {
    rank: number;
    total: number;
  };
}

export interface PortalAcademicSummary {
  totalCredits: number;
  appliedCredits: number;
  gpa: number;
  score: number;
}

// Curriculum 관련 타입들
export interface PortalCurriculumData {
  courses: PortalCourseCreationData[];
  professors: PortalProfessorCreationData[];
  offerings: PortalOfferingCreationData[];
}

export interface PortalCourseCreationData {
  courseCode: string;
  courseName: string;
  points: number;
}

export interface PortalProfessorCreationData {
  professorName: string;
}

export interface PortalOfferingCreationData {
  courseCode: string;
  year: number;
  semester: number;
  classSection?: string;
  professorName?: string;
  scheduleSummary?: string;
  evaluationType?: EvaluationType;
  isVideoLecture?: boolean;
  subjectEstablishmentSemester?: number;
  facultyDivisionName?: CourseAreaType;
  areaCode?: number;
  originalAreaCode?: number;
  points?: number;
  hostDepartment?: string;
}
