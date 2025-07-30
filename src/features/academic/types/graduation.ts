// Codegen으로 생성된 서버 타입들을 직접 사용
import type {
  AreaProgressDto,
  CourseDto,
  CourseDetailDto,
  AcademicSummaryResponse,
  SemesterGradeResponse,
  Courses,
  AcademicRecordResponse,
  GraduationProgressResponse
} from '@/shared/api/data-contracts';

// Type aliases for better naming
export type AreaProgress = AreaProgressDto;
export type Course = CourseDto;
export type CourseDetail = CourseDetailDto;
export type AcademicSummary = AcademicSummaryResponse;
export type SemesterGrade = SemesterGradeResponse;
export type CoursesByType = Courses;
export type AcademicRecordData = AcademicRecordResponse;

// Re-export 원본 타입 (필요시 사용)
// export type { GraduationProgressResponse } from '@/shared/api/data-contracts';

// Composite 데이터 타입 (페이지에서 사용)
export interface GraduationPageData {
  graduationProgress: AreaProgress[];
  academicSummary: AcademicSummary;
  semesterGrades: SemesterGrade[];
}

// 필요시 추가 타입들
export type CourseAreaType = AreaProgress['areaType'];