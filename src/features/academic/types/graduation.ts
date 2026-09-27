// Codegen으로 생성된 서버 타입들을 직접 사용
import type {
  AreaProgressDto,
  CourseDto,
  CourseDetailDto,
  AcademicSummaryResponse,
  SemesterSummaryResponse,
  Courses,
  AcademicRecordResponse,
  GraduationProgressResponse,
  TransferGraduationProgressDto,
  TransferAreaProgressDto,
  DesignatedCourseProgressDto,
} from '@/shared/api/data-contracts';

// Type aliases for better naming
export type AreaProgress = AreaProgressDto;
export type Course = CourseDto;
export type CourseDetail = CourseDetailDto;
export type AcademicSummary = AcademicSummaryResponse;
export type SemesterGrade = SemesterSummaryResponse;
export type CoursesByType = Courses;
export type AcademicRecordData = AcademicRecordResponse;

// Re-export 원본 타입 (필요시 사용)
// export type { GraduationProgressResponse } from '@/shared/api/data-contracts';

// Composite 데이터 타입 (페이지에서 사용)
export interface GraduationPageData {
  graduationProgress: AreaProgress[] | undefined;
  academicSummary: AcademicSummary | undefined;
  semesterGrades: SemesterGrade[] | undefined;
}

// 필요시 추가 타입들
export type CourseAreaType = AreaProgress['areaType'];

// 편입생 부분 진단 — analysisType === 'TRANSFER' 일 때 transferProgress 로 내려온다.
export type GraduationAnalysisType = GraduationProgressResponse['analysisType'];
export type TransferProgress = TransferGraduationProgressDto;
export type TransferAreaProgress = TransferAreaProgressDto;
export type DesignatedCourseProgress = DesignatedCourseProgressDto;
/** COMPARISON(기준 비교) / EARNED_ONLY(취득학점만) / UNAVAILABLE(기준 미확정). */
export type TransferAreaEvaluationType = NonNullable<TransferAreaProgress['evaluationType']>;
export type DesignatedCourseStatus = NonNullable<DesignatedCourseProgress['status']>;